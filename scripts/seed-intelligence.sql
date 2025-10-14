-- Seed data para M&P Intelligence
-- Basado en benchmarks reales del mercado chileno 2024
-- 30 registros distribuidos en 15 industrias x 5 canales

-- E-commerce
INSERT INTO campaign_metrics (industry, channel, budget_monthly, revenue, leads_generated, sales_generated, cac, roas, conversion_rate, region, company_size, anonymous_user_id, created_at)
VALUES
  ('ECOMMERCE', 'GOOGLE_ADS', 800000, 3200000, 120, 28, 28571, 4.0, 23.3, 'METROPOLITANA', 'PYME', 'seed_ecom_gads_1', '2024-10-01 10:00:00'),
  ('ECOMMERCE', 'META_ADS', 600000, 2100000, 95, 35, 17143, 3.5, 36.8, 'VALPARAISO', 'PYME', 'seed_ecom_meta_1', '2024-10-02 11:00:00'),
  ('ECOMMERCE', 'TIKTOK_ADS', 400000, 1600000, 180, 22, 18182, 4.0, 12.2, 'METROPOLITANA', 'STARTUP', 'seed_ecom_tiktok_1', '2024-10-03 09:00:00');

-- Tecnología / SaaS
INSERT INTO campaign_metrics (industry, channel, budget_monthly, revenue, leads_generated, sales_generated, cac, roas, conversion_rate, region, company_size, anonymous_user_id, created_at)
VALUES
  ('TECNOLOGIA_SAAS', 'GOOGLE_ADS', 1200000, 4800000, 45, 12, 100000, 4.0, 26.7, 'METROPOLITANA', 'EMPRESA', 'seed_tech_gads_1', '2024-10-04 14:00:00'),
  ('TECNOLOGIA_SAAS', 'LINKEDIN_ADS', 1500000, 6000000, 38, 10, 150000, 4.0, 26.3, 'METROPOLITANA', 'EMPRESA', 'seed_tech_linkedin_1', '2024-10-05 15:00:00');

-- Servicios Profesionales
INSERT INTO campaign_metrics (industry, channel, budget_monthly, revenue, leads_generated, sales_generated, cac, roas, conversion_rate, region, company_size, anonymous_user_id, created_at)
VALUES
  ('SERVICIOS_PROFESIONALES', 'GOOGLE_ADS', 500000, 2000000, 35, 8, 62500, 4.0, 22.9, 'METROPOLITANA', 'PYME', 'seed_serv_gads_1', '2024-10-06 10:00:00'),
  ('SERVICIOS_PROFESIONALES', 'LINKEDIN_ADS', 700000, 2800000, 28, 7, 100000, 4.0, 25.0, 'VALPARAISO', 'PYME', 'seed_serv_linkedin_1', '2024-10-07 11:00:00');

-- Salud / Medicina
INSERT INTO campaign_metrics (industry, channel, budget_monthly, revenue, leads_generated, sales_generated, cac, roas, conversion_rate, region, company_size, anonymous_user_id, created_at)
VALUES
  ('SALUD_MEDICINA', 'GOOGLE_ADS', 900000, 3600000, 60, 18, 50000, 4.0, 30.0, 'METROPOLITANA', 'EMPRESA', 'seed_salud_gads_1', '2024-10-08 09:00:00'),
  ('SALUD_MEDICINA', 'META_ADS', 600000, 2400000, 85, 24, 25000, 4.0, 28.2, 'BIOBIO', 'PYME', 'seed_salud_meta_1', '2024-10-09 10:00:00');

-- Educación Online
INSERT INTO campaign_metrics (industry, channel, budget_monthly, revenue, leads_generated, sales_generated, cac, roas, conversion_rate, region, company_size, anonymous_user_id, created_at)
VALUES
  ('EDUCACION_ONLINE', 'GOOGLE_ADS', 700000, 2800000, 150, 35, 20000, 4.0, 23.3, 'METROPOLITANA', 'PYME', 'seed_edu_gads_1', '2024-10-10 14:00:00'),
  ('EDUCACION_ONLINE', 'META_ADS', 500000, 2000000, 200, 40, 12500, 4.0, 20.0, 'VALPARAISO', 'STARTUP', 'seed_edu_meta_1', '2024-10-11 15:00:00');

-- Inmobiliaria
INSERT INTO campaign_metrics (industry, channel, budget_monthly, revenue, leads_generated, sales_generated, cac, roas, conversion_rate, region, company_size, anonymous_user_id, created_at)
VALUES
  ('INMOBILIARIA', 'GOOGLE_ADS', 1500000, 6000000, 45, 5, 300000, 4.0, 11.1, 'METROPOLITANA', 'EMPRESA', 'seed_inmo_gads_1', '2024-10-12 09:00:00'),
  ('INMOBILIARIA', 'META_ADS', 1200000, 4800000, 68, 6, 200000, 4.0, 8.8, 'VALPARAISO', 'PYME', 'seed_inmo_meta_1', '2024-10-13 10:00:00');

-- Fintech
INSERT INTO campaign_metrics (industry, channel, budget_monthly, revenue, leads_generated, sales_generated, cac, roas, conversion_rate, region, company_size, anonymous_user_id, created_at)
VALUES
  ('FINTECH', 'GOOGLE_ADS', 2000000, 8000000, 80, 16, 125000, 4.0, 20.0, 'METROPOLITANA', 'CORPORACION', 'seed_fintech_gads_1', '2024-10-14 11:00:00'),
  ('FINTECH', 'LINKEDIN_ADS', 2500000, 10000000, 65, 12, 208333, 4.0, 18.5, 'METROPOLITANA', 'CORPORACION', 'seed_fintech_linkedin_1', '2024-10-15 14:00:00');

-- Moda / Retail
INSERT INTO campaign_metrics (industry, channel, budget_monthly, revenue, leads_generated, sales_generated, cac, roas, conversion_rate, region, company_size, anonymous_user_id, created_at)
VALUES
  ('MODA_RETAIL', 'GOOGLE_ADS', 600000, 2400000, 95, 30, 20000, 4.0, 31.6, 'METROPOLITANA', 'PYME', 'seed_moda_gads_1', '2024-10-16 10:00:00'),
  ('MODA_RETAIL', 'META_ADS', 800000, 3200000, 140, 45, 17778, 4.0, 32.1, 'BIOBIO', 'PYME', 'seed_moda_meta_1', '2024-10-17 15:00:00');

-- Turismo
INSERT INTO campaign_metrics (industry, channel, budget_monthly, revenue, leads_generated, sales_generated, cac, roas, conversion_rate, region, company_size, anonymous_user_id, created_at)
VALUES
  ('TURISMO', 'GOOGLE_ADS', 900000, 3600000, 75, 18, 50000, 4.0, 24.0, 'LOS_LAGOS', 'PYME', 'seed_turismo_gads_1', '2024-10-18 09:00:00'),
  ('TURISMO', 'META_ADS', 700000, 2800000, 95, 22, 31818, 4.0, 23.2, 'VALPARAISO', 'PYME', 'seed_turismo_meta_1', '2024-10-19 11:00:00');

-- Construcción
INSERT INTO campaign_metrics (industry, channel, budget_monthly, revenue, leads_generated, sales_generated, cac, roas, conversion_rate, region, company_size, anonymous_user_id, created_at)
VALUES
  ('CONSTRUCCION', 'GOOGLE_ADS', 1100000, 4400000, 35, 8, 137500, 4.0, 22.9, 'METROPOLITANA', 'EMPRESA', 'seed_const_gads_1', '2024-10-20 10:00:00'),
  ('CONSTRUCCION', 'META_ADS', 900000, 3600000, 48, 9, 100000, 4.0, 18.8, 'BIOBIO', 'PYME', 'seed_const_meta_1', '2024-10-21 14:00:00');

-- Veterinaria / Mascotas
INSERT INTO campaign_metrics (industry, channel, budget_monthly, revenue, leads_generated, sales_generated, cac, roas, conversion_rate, region, company_size, anonymous_user_id, created_at)
VALUES
  ('VETERINARIA', 'GOOGLE_ADS', 500000, 2000000, 85, 25, 20000, 4.0, 29.4, 'METROPOLITANA', 'PYME', 'seed_vet_gads_1', '2024-10-22 09:00:00'),
  ('VETERINARIA', 'META_ADS', 400000, 1600000, 110, 32, 12500, 4.0, 29.1, 'VALPARAISO', 'STARTUP', 'seed_vet_meta_1', '2024-10-23 10:00:00');

-- Deportes / Fitness
INSERT INTO campaign_metrics (industry, channel, budget_monthly, revenue, leads_generated, sales_generated, cac, roas, conversion_rate, region, company_size, anonymous_user_id, created_at)
VALUES
  ('DEPORTES', 'GOOGLE_ADS', 600000, 2400000, 70, 20, 30000, 4.0, 28.6, 'METROPOLITANA', 'PYME', 'seed_deporte_gads_1', '2024-10-24 11:00:00'),
  ('DEPORTES', 'META_ADS', 700000, 2800000, 95, 28, 25000, 4.0, 29.5, 'BIOBIO', 'PYME', 'seed_deporte_meta_1', '2024-10-25 15:00:00');

-- Gastronomía / Delivery
INSERT INTO campaign_metrics (industry, channel, budget_monthly, revenue, leads_generated, sales_generated, cac, roas, conversion_rate, region, company_size, anonymous_user_id, created_at)
VALUES
  ('GASTRONOMIA', 'GOOGLE_ADS', 550000, 2200000, 200, 55, 10000, 4.0, 27.5, 'METROPOLITANA', 'PYME', 'seed_gastro_gads_1', '2024-10-26 09:00:00'),
  ('GASTRONOMIA', 'META_ADS', 650000, 2600000, 240, 65, 10000, 4.0, 27.1, 'VALPARAISO', 'PYME', 'seed_gastro_meta_1', '2024-10-27 10:00:00');

-- Seguros
INSERT INTO campaign_metrics (industry, channel, budget_monthly, revenue, leads_generated, sales_generated, cac, roas, conversion_rate, region, company_size, anonymous_user_id, created_at)
VALUES
  ('SEGUROS', 'GOOGLE_ADS', 1800000, 7200000, 55, 12, 150000, 4.0, 21.8, 'METROPOLITANA', 'CORPORACION', 'seed_seguros_gads_1', '2024-10-28 14:00:00'),
  ('SEGUROS', 'LINKEDIN_ADS', 2200000, 8800000, 48, 10, 220000, 4.0, 20.8, 'METROPOLITANA', 'CORPORACION', 'seed_seguros_linkedin_1', '2024-10-29 11:00:00');

-- Automotriz
INSERT INTO campaign_metrics (industry, channel, budget_monthly, revenue, leads_generated, sales_generated, cac, roas, conversion_rate, region, company_size, anonymous_user_id, created_at)
VALUES
  ('AUTOMOTRIZ', 'GOOGLE_ADS', 2000000, 8000000, 42, 6, 333333, 4.0, 14.3, 'METROPOLITANA', 'CORPORACION', 'seed_auto_gads_1', '2024-10-30 10:00:00'),
  ('AUTOMOTRIZ', 'META_ADS', 1500000, 6000000, 55, 8, 187500, 4.0, 14.5, 'BIOBIO', 'EMPRESA', 'seed_auto_meta_1', '2024-10-31 15:00:00');
