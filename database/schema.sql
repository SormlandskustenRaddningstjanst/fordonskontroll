create table stations (
  id uuid primary key,
  name text
);

create table vehicles (
  id uuid primary key,
  name text,
  status text
);

create table checklist_templates (
  id uuid primary key,
  name text,
  interval text
);

create table checklist_items (
  id uuid primary key,
  template_id uuid,
  title text,
  instruction_text text,
  is_critical boolean
);

create table inspections (
  id uuid primary key,
  vehicle_id uuid,
  status text
);

create table deviations (
  id uuid primary key,
  title text,
  status text
);
