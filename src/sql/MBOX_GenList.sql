CREATE FUNCTION MBOX_GenList -- M-BOX 관리 (생성분)
(
    @시작일자 varchar(8),
    @종료일자 varchar(8),
    @제품유형 varchar(8),
    @SCRAP_CODE varchar(1),
    @SEL_TYPE INT,  --RUN No=1, CELL_No=2, MBOX_No=3
    @SEL_VALUE VARCHAR(50)
)
RETURNS TABLE
AS
RETURN
(
select 
	'M-BOX' as 상태,
	CONVERT(DATE,substring( Start_Time, 1, 8)) as 등록일시,
	MBOX_NO,
	CELL_NO,
	CST_NO,
	BEF_RUNNO As Before,
	AFT_RUNNO As After,
	수량,
	등록자,
	등록여부 As 등록서명,
	승인자,
	승인여부 As 승인서명,
	특이사항
from	d23_MRUNBOX파일 a
where	1 = 1
	and a.End_time >= @시작일자||' 000000'
	and a.End_time <= @종료일자||' 235959'
	and nullif(a.AFT_RUNNO,'') is not null
	and a.scrap_code = @SCRAP_CODE
	and BEF_RUNNO like coalesce(nullif(@제품유형,''),'%')||'%'
	and 1=CASE WHEN @SEL_VALUE='' THEN 1
			   WHEN @SEL_TYPE=1 AND BEF_RUNNO=@SEL_VALUE THEN 1
			   WHEN @SEL_TYPE=2 AND CELL_NO=@SEL_VALUE THEN 1 
			   WHEN @SEL_TYPE=3 AND MBOX_NO=@SEL_VALUE THEN 1 
			   ELSE 0 
		  END 
UNION ALL
select 
	'합 계' as 상태,
	NULL as 등록일시,
	NULL as MBOX_NO,
	NULL as CELL_NO,
	NULL as CST_NO,
	NULL as Before,
	NULL as After,
	SUM(수량),
	NULL as 등록자,
	NULL as 등록서명,
	NULL as 승인자,
	NULL as 승인서명,
	NULL as 특이사항
from	d23_MRUNBOX파일 a
where	1 = 1
	and a.End_time >= @시작일자||' 000000'
	and a.End_time <= @종료일자||' 235959'
	and nullif(a.AFT_RUNNO,'') is not null
	and a.scrap_code = @SCRAP_CODE
	and BEF_RUNNO like coalesce(nullif(@제품유형,''),'%')||'%'
	and 1=CASE WHEN @SEL_VALUE='' THEN 1
			   WHEN @SEL_TYPE=1 AND BEF_RUNNO=@SEL_VALUE THEN 1
			   WHEN @SEL_TYPE=2 AND CELL_NO=@SEL_VALUE THEN 1 
			   WHEN @SEL_TYPE=3 AND MBOX_NO=@SEL_VALUE THEN 1 
			   ELSE 0 
		  END 	
)