-- Temporary, read-only access to completed dashboard results only.
-- Existing authenticated policies and the approved-user list remain intact.
grant select (test_id,test_date,customer_name,farm_name,lab_name,area,field_force,sample_type,test_category,detail,result,sample_count,status,quality_flag,added_at) on public.lab_result_rows to anon;
create policy "temporary public completed lab results"
on public.lab_result_rows for select to anon
using (status = 'Complete');
