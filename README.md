# cron-automation

Wanna set up cron jobs dynamically?
Here's a boilerplate for that now you can set up cronjobs using apis and also make them inactive whenever you like

Database Schema

CREATE TABLE public.cron_scheduled (

id serial4 NOT NULL,

public_id uuid NOT NULL,

scheduled_time varchar NOT NULL,

status varchar(10) NOT NULL DEFAULT 'active'::character varying,

response text NULL,

attempts int4 NOT NULL DEFAULT 0,

created_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,

updated_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,

CONSTRAINT cron_scheduled_pkey PRIMARY KEY (id)
);
