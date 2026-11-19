-- Run when restoring private access; also set publicReadOnly to false in config.js.
drop policy if exists "temporary public completed lab results" on public.lab_result_rows;
revoke select (test_id,test_date,customer_name,farm_name,lab_name,area,field_force,sample_type,test_category,detail,result,sample_count,status,quality_flag,added_at) on public.lab_result_rows from anon;
