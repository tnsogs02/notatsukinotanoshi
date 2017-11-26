SELECT total, participated, contribution, ip_org, time AS last_active FROM (
  SELECT 
    count(*) OVER() AS participated, 
    count(*) AS contribution, 
    ip_org,
    MAX(submit_time) AT TIME ZONE 'Taipei Standard Time' AS time
  FROM notatsukinotanoshi.submit_count 
  WHERE submit_type = 2 GROUP BY ip_org
) t1, (
  SELECT count(*) AS total FROM notatsukinotanoshi.submit_count WHERE submit_type = 2
) t2 ORDER BY t1.time DESC