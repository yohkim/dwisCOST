
-- select * from Get이물제거Auto(from_yyyymmdd, to_yyyymmdd, 구분)
CREATE FUNCTION Get_내포장실적_설비이물제거Auto
(
    @from_yyyymmdd varchar(10),
    @to_yyyymmdd varchar(10),
    @구분 varchar(10)
)
RETURNS TABLE
AS
RETURN
(
	-- 설비 DATA 관리창
	-- 생성분(SI대기)
	-- 폐기분(PACK상태:폐기)
	-- 미생성분 : 발행자, 승인자가 없는 값\
	select 구분, run_no, pack_no, box_no, cell수량, replace(replace(convert(varchar(19), 작업일자, 20),'-',''),':','') 작업일자, 작업자, 설비약명 설비, shift, '' svi, agb, pfl, 처리시각, 발행자, 발행자서명, 승인자, 승인자서명, 특이사항, PACK상태
	from
	(
		select case when pack상태 = '폐기' then '폐기분'
		            when pack상태 = 'SI 대기' then '생성분'
		            --when NULLIF(PACK상태, '') IS NULL then '미생성분'
		            when nullif(발행자,'') is null and nullif(승인자,'') is null and pack상태 != '폐기' then '미생성분'
		            else 'ETC'
		       end 구분,
		       q.*
		from
		(
			select a.*, b.box_no, c.설비약명,
			       작업일자,  작업자 , shift, 
			       d.설비약명  agb, e.설비약명 pfl,
			       처리시각,  발행자, 발행자서명, 승인자, 승인자서명, 특이사항, PACK상태
			from
			(
				select run_no, pack_no, eqp_id, --OPER_Team shift, OPER_NAME 작업자, 
				       count(*) cell수량
				from d26_FMRMachine_CellInspInfo
				where 1=1
				and Format(REG_DATE, 'yyyy-MM-dd') between @from_yyyymmdd and @to_yyyymmdd --DATEADD(MONTH, -3, GETDATE()) and getdate()
			--	and run_no = '8091B2412-P0146'
		--		and run_no = '7073B2411-P0003'
			--	and pack_no = 'LJ9707334EE1DLD2N1OBK000002090'
			--	and run_no in
			--	(
			--	'7073B2411-P0162',
			--	'7073B2411-P0164',
			--	'7073B2411-P0165',
			--	'7073B2411-P0166'
			--	)
			--	and pack상태 != '폐기'
				group by run_no, pack_no, eqp_id
				--, OPER_Team , OPER_NAME 
			) a
			left join 
			(
				select run_id, eqp_id, pack_no, box_no, CELL수량,
				       reg_date 작업일자, oper_name 작업자 , Oper_team shift, 
				       처리시각,  발행자, 발행자서명, 승인자, 승인자서명, PACK상태, 폐기사유, 
				       case when pack상태 = '폐기' then PACK상태 + '(폐기사유 : ' + 폐기사유 + ')' else '' end 특이사항
				--
				--select *
				from d26_FMRMachine_PackInfo
				where 1=1
			--	and 
			--	and pack_no = 'LJ9707334EE1DLD2N1OB4000016090'
				--and run_id in
				--(
				--'7073B2411-P0162',
				--'7073B2411-P0164',
				--'7073B2411-P0165',
				--'7073B2411-P0166'
				--);
			) b
			on a.pack_no = b.pack_no and a.eqp_id = b.eqp_id
			left join 
			(
			--	select 설비번호, 설비명, 설비약명 --, 공정코드
			--	from dw_equipment_mast
			--	where 1=1
			--	and line = 'DFB1'
			----	and 설비번호 = '534'
			--	
				select distinct 설비번호, 설비명, 설비약명 --, 공정코드
				from dw_equipment_mast
			) c
			on a.eqp_id = c.설비번호
			left join 
			(
				select distinct run_no, x.공정코드, machine_code, 설비약명 
				from d22_RUN제조VLR x
				left join dw_equipment_mast y
				on x.machine_code= 설비번호
				where 공장코드 = '2'
				and x.공정코드 = '056'
			) d
			on a.run_no = d.run_no
			left join 
			(
				select distinct run_no, x.공정코드, machine_code, 설비약명 
				from d22_RUN제조VLR x
				left join dw_equipment_mast y
				on x.machine_code= 설비번호
				where 공장코드 = '2'
				and x.공정코드 = '061'
			) e
			on a.run_no = e.run_no
			where nullif(a.pack_no,'') is not null
		) q	
	) r
	where 구분 = @구분
--	order by 1,2,3	
);
