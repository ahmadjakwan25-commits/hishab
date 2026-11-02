-- আল-মিফতাহ ব্যবহারের নামহীন হিসাব — Supabase এর SQL Editor এ পুরোটা কপি করে একবার Run করুন।
-- ★ নিচের  CHANGE-ME-1234  লেখাটা বদলে নিজের একটা গোপন পিন (সংখ্যা/অক্ষর) বসান। এই পিন দিয়েই শুধু আপনি পরিসংখ্যান দেখবেন।

create table if not exists mf_devices(
  id text primary key,
  first_seen timestamptz not null default now(),
  last_seen  timestamptz not null default now(),
  opens int not null default 0,
  installed boolean not null default false,
  platform text, lang text, ver text
);
create table if not exists mf_daily(day date not null, id text not null, primary key(day,id));
create table if not exists mf_feat(day date not null, feat text not null, n int not null default 0, primary key(day,feat));
create table if not exists mf_conf(k text primary key, v text not null);

alter table mf_devices enable row level security;
alter table mf_daily   enable row level security;
alter table mf_feat    enable row level security;
alter table mf_conf    enable row level security;
-- কোনো policy দেওয়া হয়নি: টেবিল সরাসরি কেউ পড়তে/লিখতে পারবে না, শুধু নিচের দুটি ফাংশন দিয়ে।

insert into mf_conf(k,v) values('pin','CHANGE-ME-1234')
on conflict (k) do nothing;

create or replace function miftah_ping(p_id text, p_platform text, p_lang text, p_ver text,
                                       p_installed boolean, p_open boolean, p_feat jsonb)
returns void language plpgsql security definer set search_path = public as $$
declare d date := (now() at time zone 'Asia/Dhaka')::date; r record; c int := 0;
begin
  if p_id is null or length(p_id) < 8 or length(p_id) > 64 then return; end if;
  insert into mf_devices(id,platform,lang,ver,installed,opens)
  values(p_id, left(p_platform,20), left(p_lang,12), left(p_ver,12), coalesce(p_installed,false), case when p_open then 1 else 0 end)
  on conflict (id) do update set
    last_seen = now(),
    opens = mf_devices.opens + case when p_open then 1 else 0 end,
    installed = mf_devices.installed or coalesce(excluded.installed,false),
    platform = excluded.platform, lang = excluded.lang, ver = excluded.ver;
  insert into mf_daily(day,id) values(d,p_id) on conflict do nothing;
  if p_feat is not null and jsonb_typeof(p_feat) = 'object' then
    for r in select key, value from jsonb_each_text(p_feat) loop
      c := c + 1; exit when c > 30;
      if length(r.key) between 1 and 30 and r.value ~ '^[0-9]{1,3}$' then
        insert into mf_feat(day,feat,n) values(d, r.key, least(r.value::int,50))
        on conflict (day,feat) do update set n = mf_feat.n + least(r.value::int,50);
      end if;
    end loop;
  end if;
end $$;

create or replace function miftah_stats(p_pin text)
returns json language plpgsql security definer set search_path = public as $$
declare d date := (now() at time zone 'Asia/Dhaka')::date; ok text; res json;
begin
  select v into ok from mf_conf where k = 'pin';
  if ok is null or p_pin is distinct from ok then raise exception 'pin ভুল'; end if;
  select json_build_object(
    'total',     (select count(*) from mf_devices),
    'installed', (select count(*) from mf_devices where installed),
    'opens',     (select coalesce(sum(opens),0) from mf_devices),
    'active1',   (select count(*) from mf_daily where day = d),
    'active7',   (select count(distinct id) from mf_daily where day > d - 7),
    'active30',  (select count(distinct id) from mf_daily where day > d - 30),
    'new1',      (select count(*) from mf_devices where (first_seen at time zone 'Asia/Dhaka')::date = d),
    'new7',      (select count(*) from mf_devices where (first_seen at time zone 'Asia/Dhaka')::date > d - 7),
    'daily',     (select coalesce(json_agg(json_build_object('d',day,'n',n) order by day),'[]'::json)
                  from (select day, count(*) n from mf_daily where day > d - 14 group by day) x),
    'feats',     (select coalesce(json_agg(json_build_object('f',feat,'n',n) order by n desc),'[]'::json)
                  from (select feat, sum(n) n from mf_feat where day > d - 30 group by feat order by sum(n) desc limit 20) y),
    'platforms', (select coalesce(json_agg(json_build_object('p',coalesce(platform,'?'),'n',n) order by n desc),'[]'::json)
                  from (select platform, count(*) n from mf_devices group by platform) z),
    'vers',      (select coalesce(json_agg(json_build_object('v',coalesce(ver,'?'),'n',n) order by n desc),'[]'::json)
                  from (select ver, count(*) n from mf_devices group by ver) w)
  ) into res;
  return res;
end $$;

grant execute on function miftah_ping(text,text,text,text,boolean,boolean,jsonb) to anon, authenticated;
grant execute on function miftah_stats(text) to anon, authenticated;
