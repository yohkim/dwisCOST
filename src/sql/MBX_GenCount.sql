
CREATE FUNCTION MBOX_GenCount -- M-BOX 관리 (생성분)
(
    @시작일자 varchar(8),
    @종료일자 varchar(8),
    @제품유형 varchar(8),
	@SEL_TYPE INT =1, --RUN No=1, CELL_No=2, MBOX_No=3
	@SEL_VALUE varchar(50)=''
)
RETURNS TABLE
AS
RETURN
(
	SELECT code,구분,COALESCE(계,0) 계,COALESCE(A,0) A,COALESCE(U,0) U,COALESCE(C,0) C,COALESCE(F,0) F,COALESCE(P,0) P,
					COALESCE(M,0) M,COALESCE(G,0) G,COALESCE(I,0) I,COALESCE(R,0) R,COALESCE(E,0) E
	FROM
	(
		select  'M-BOX' code,'Box' 구분,scrap_code,count(distinct mbox_no) Mbox_cnt
		from d23_MRUNBOX파일 a 
		where 1=1
			and a.End_time >= @시작일자+' 000000'
			and a.End_time <= @종료일자+' 235959'
			and nullif(a.AFT_RUNNO,'') is null
			and BEF_RUNNO like coalesce(nullif(@제품유형,''),'%')+'%'
			and 1=CASE WHEN @SEL_VALUE='' THEN 1
			   WHEN @SEL_TYPE=1 AND BEF_RUNNO=@SEL_VALUE THEN 1
			   WHEN @SEL_TYPE=2 AND CELL_NO=@SEL_VALUE THEN 1 
			   WHEN @SEL_TYPE=3 AND MBOX_NO=@SEL_VALUE THEN 1 
			   ELSE 0 
		  	END 
		group by scrap_code		
		union ALL 
		select  'M-BOX' code,'Box' 구분,'A',0 Mbox_cnt
		union ALL
		select  'M-BOX' code,'Box' 구분,'계',count(distinct mbox_no) Mbox_cnt
		from d23_MRUNBOX파일 a 
		where 1=1
			and a.End_time >= @시작일자+' 000000'
			and a.End_time <= @종료일자+' 235959'
			and nullif(a.AFT_RUNNO,'') is null
			and BEF_RUNNO like coalesce(nullif(@제품유형,''),'%')+'%' 
			and 1=CASE WHEN @SEL_VALUE='' THEN 1
			   WHEN @SEL_TYPE=1 AND BEF_RUNNO=@SEL_VALUE THEN 1
			   WHEN @SEL_TYPE=2 AND CELL_NO=@SEL_VALUE THEN 1 
			   WHEN @SEL_TYPE=3 AND MBOX_NO=@SEL_VALUE THEN 1 
			   ELSE 0 
		  	END 
	) AS SourceTable 
	PIVOT
	(
	      sum(mbox_cnt)
	      FOR scrap_code IN ([계], [A], [U], [C], [F], [P], [M], [G], [I], [R], [E])
	      /* SCRAP_CODE 순서는 아래 Query 참조
	       * SELECT STRING_AGG(QUOTENAME(code), ', ') WITHIN GROUP (ORDER BY cast(tray_cell as int))
		  	FROM (select code,tray_cell from  dw_common_code where maj_code='65') as Temp*/
	) AS Pivot1
	Union all  
	SELECT code,구분,COALESCE(계,0) 계,COALESCE(A,0) A,COALESCE(U,0) U,COALESCE(C,0) C,COALESCE(F,0) F,COALESCE(P,0) P,
					COALESCE(M,0) M,COALESCE(G,0) G,COALESCE(I,0) I,COALESCE(R,0) R,COALESCE(E,0) E
	FROM
	(
		select  'M-BOX' Code,'Cell' 구분,scrap_code,sum(수량) Cell_cnt --select *
		from d23_MRUNBOX파일 a 
		where 1=1
			and a.End_time >= @시작일자+' 000000'
			and a.End_time <= @종료일자+' 235959'
			and nullif(a.AFT_RUNNO,'') is null
			and BEF_RUNNO like coalesce(nullif(@제품유형,''),'%')+'%'
			and 1=CASE WHEN @SEL_VALUE='' THEN 1
			   WHEN @SEL_TYPE=1 AND BEF_RUNNO=@SEL_VALUE THEN 1
			   WHEN @SEL_TYPE=2 AND CELL_NO=@SEL_VALUE THEN 1 
			   WHEN @SEL_TYPE=3 AND MBOX_NO=@SEL_VALUE THEN 1 
			   ELSE 0 
		  	END 
		group by scrap_code			
		union ALL 
		select  'M-BOX' code,'Cell' 구분,'A',0 Cell_cnt
		union ALL
		select  'M-BOX' Code,'Cell' 구분,'계',sum(수량) Cell_cnt
		from d23_MRUNBOX파일 a 
		where 1=1
			and a.End_time >= @시작일자+' 000000'
			and a.End_time <= @종료일자+' 235959'
			and nullif(a.AFT_RUNNO,'') is null
			and BEF_RUNNO like coalesce(nullif(@제품유형,''),'%')+'%'
			and 1=CASE WHEN @SEL_VALUE='' THEN 1
			   WHEN @SEL_TYPE=1 AND BEF_RUNNO=@SEL_VALUE THEN 1
			   WHEN @SEL_TYPE=2 AND CELL_NO=@SEL_VALUE THEN 1 
			   WHEN @SEL_TYPE=3 AND MBOX_NO=@SEL_VALUE THEN 1 
			   ELSE 0 
		  	END 
	) AS SourceTable
	PIVOT
    (
      sum(Cell_cnt)
      FOR scrap_code IN ([계], [A], [U], [C], [F], [P], [M], [G], [I], [R], [E])
	) AS Pivot2
	Union All
	SELECT code,구분,COALESCE(계,0) 계,COALESCE(A,0) A,COALESCE(U,0) U,COALESCE(C,0) C,COALESCE(F,0) F,COALESCE(P,0) P,
					COALESCE(M,0) M,COALESCE(G,0) G,COALESCE(I,0) I,COALESCE(R,0) R,COALESCE(E,0) E
	FROM
	(
		select  'M-RUN' code,'Box' 구분,scrap_code,count(distinct mbox_no) Mbox_cnt
		from d23_MRUNBOX파일 a 
		where 1=1
			and a.End_time >= @시작일자+' 000000'
			and a.End_time <= @종료일자+' 235959'
			and nullif(a.AFT_RUNNO,'') is not null
			and BEF_RUNNO like coalesce(nullif(@제품유형,''),'%')+'%'
			and 1=CASE WHEN @SEL_VALUE='' THEN 1
			   WHEN @SEL_TYPE=1 AND BEF_RUNNO=@SEL_VALUE THEN 1
			   WHEN @SEL_TYPE=2 AND CELL_NO=@SEL_VALUE THEN 1 
			   WHEN @SEL_TYPE=3 AND MBOX_NO=@SEL_VALUE THEN 1 
			   ELSE 0 
		  	END 
		group by scrap_code		
		union ALL 
		select  'M-RUN' code,'Box' 구분,'A',0 Mbox_cnt
		union ALL
		select  'M-RUN' code,'Box' 구분,'계',count(distinct mbox_no) Mbox_cnt
		from d23_MRUNBOX파일 a 
		where 1=1
			and a.End_time >= @시작일자+' 000000'
			and a.End_time <= @종료일자+' 235959'
			and nullif(a.AFT_RUNNO,'') is not null
			and BEF_RUNNO like coalesce(nullif(@제품유형,''),'%')+'%'
			and 1=CASE WHEN @SEL_VALUE='' THEN 1
			   WHEN @SEL_TYPE=1 AND BEF_RUNNO=@SEL_VALUE THEN 1
			   WHEN @SEL_TYPE=2 AND CELL_NO=@SEL_VALUE THEN 1 
			   WHEN @SEL_TYPE=3 AND MBOX_NO=@SEL_VALUE THEN 1 
			   ELSE 0 
		  	END 
	) AS SourceTable
	PIVOT
	(
	      sum(mbox_cnt)
	      FOR scrap_code IN ([계], [A], [U], [C], [F], [P], [M], [G], [I], [R], [E])
	) AS Pivot3
	Union all  
	SELECT code,구분,COALESCE(계,0) 계,COALESCE(A,0) A,COALESCE(U,0) U,COALESCE(C,0) C,COALESCE(F,0) F,COALESCE(P,0) P,
					COALESCE(M,0) M,COALESCE(G,0) G,COALESCE(I,0) I,COALESCE(R,0) R,COALESCE(E,0) E
	FROM
	(
		select  'M-RUN' code,'Cell' 구분,scrap_code,sum(수량) Cell_cnt
		from d23_MRUNBOX파일 a 
		where 1=1
			and a.End_time >= @시작일자+' 000000'
			and a.End_time <= @종료일자+' 235959'
			and nullif(a.AFT_RUNNO,'') is not null
			and BEF_RUNNO like coalesce(nullif(@제품유형,''),'%')+'%'
			and 1=CASE WHEN @SEL_VALUE='' THEN 1
			   WHEN @SEL_TYPE=1 AND BEF_RUNNO=@SEL_VALUE THEN 1
			   WHEN @SEL_TYPE=2 AND CELL_NO=@SEL_VALUE THEN 1 
			   WHEN @SEL_TYPE=3 AND MBOX_NO=@SEL_VALUE THEN 1 
			   ELSE 0 
		  	END 
		group by scrap_code		
		union ALL 
		select  'M-RUN' code,'Cell' 구분,'A',0 Cell_cnt
		union ALL
		select  'M-RUN' code,'Cell' 구분,'계',sum(수량) Cell_cnt
		from d23_MRUNBOX파일 a 
		where 1=1
			and a.End_time >= @시작일자+' 000000'
			and a.End_time <= @종료일자+' 235959'
			and nullif(a.AFT_RUNNO,'') is not null
			and BEF_RUNNO like coalesce(nullif(@제품유형,''),'%')+'%'
			and 1=CASE WHEN @SEL_VALUE='' THEN 1
			   WHEN @SEL_TYPE=1 AND BEF_RUNNO=@SEL_VALUE THEN 1
			   WHEN @SEL_TYPE=2 AND CELL_NO=@SEL_VALUE THEN 1 
			   WHEN @SEL_TYPE=3 AND MBOX_NO=@SEL_VALUE THEN 1 
			   ELSE 0 
		  	END 
	) AS SourceTable
	PIVOT
    (
      sum(Cell_cnt)
      FOR scrap_code IN ([계], [A], [U], [C], [F], [P], [M], [G], [I], [R], [E])
	) AS Pivot4
	Union ALL 
	SELECT code,구분,COALESCE(계,0) 계,COALESCE(A,0) A,COALESCE(U,0) U,COALESCE(C,0) C,COALESCE(F,0) F,COALESCE(P,0) P,
					COALESCE(M,0) M,COALESCE(G,0) G,COALESCE(I,0) I,COALESCE(R,0) R,COALESCE(E,0) E
	FROM
	(
		select  'TOTAL' code,'Box' 구분,scrap_code,count(distinct mbox_no) Mbox_cnt
		from d23_MRUNBOX파일 a 
		where 1=1
			and a.End_time >= @시작일자+' 000000'
			and a.End_time <= @종료일자+' 235959'
			and BEF_RUNNO like coalesce(nullif(@제품유형,''),'%')+'%'
			and 1=CASE WHEN @SEL_VALUE='' THEN 1
			   WHEN @SEL_TYPE=1 AND BEF_RUNNO=@SEL_VALUE THEN 1
			   WHEN @SEL_TYPE=2 AND CELL_NO=@SEL_VALUE THEN 1 
			   WHEN @SEL_TYPE=3 AND MBOX_NO=@SEL_VALUE THEN 1 
			   ELSE 0 
		  	END 
		group by scrap_code	
		union ALL 
		select  'TOTAL' code,'Box' 구분,'A',0 Mbox_cnt
		union ALL
		select  'TOTAL' code,'Box' 구분,'계',count(distinct mbox_no) Mbox_cnt
		from d23_MRUNBOX파일 a 
		where 1=1
			and a.End_time >= @시작일자+' 000000'
			and a.End_time <= @종료일자+' 235959'
			and BEF_RUNNO like coalesce(nullif(@제품유형,''),'%')+'%'
			and 1=CASE WHEN @SEL_VALUE='' THEN 1
			   WHEN @SEL_TYPE=1 AND BEF_RUNNO=@SEL_VALUE THEN 1
			   WHEN @SEL_TYPE=2 AND CELL_NO=@SEL_VALUE THEN 1 
			   WHEN @SEL_TYPE=3 AND MBOX_NO=@SEL_VALUE THEN 1 
			   ELSE 0 
		  	END 
	) AS SourceTable
	PIVOT
	(
	      sum(mbox_cnt)
	      FOR scrap_code IN ([계], [A], [U], [C], [F], [P], [M], [G], [I], [R], [E])
	) AS Pivot5
	Union all  
	SELECT code,구분,COALESCE(계,0) 계,COALESCE(A,0) A,COALESCE(U,0) U,COALESCE(C,0) C,COALESCE(F,0) F,COALESCE(P,0) P,
					COALESCE(M,0) M,COALESCE(G,0) G,COALESCE(I,0) I,COALESCE(R,0) R,COALESCE(E,0) E
	FROM
	(
		select  'TOTAL' code,'Cell' 구분,scrap_code,sum(수량) Cell_cnt
		from d23_MRUNBOX파일 a 
		where 1=1
			and a.End_time >= @시작일자+' 000000'
			and a.End_time <= @종료일자+' 235959'
			and BEF_RUNNO like coalesce(nullif(@제품유형,''),'%')+'%'
			and 1=CASE WHEN @SEL_VALUE='' THEN 1
			   WHEN @SEL_TYPE=1 AND BEF_RUNNO=@SEL_VALUE THEN 1
			   WHEN @SEL_TYPE=2 AND CELL_NO=@SEL_VALUE THEN 1 
			   WHEN @SEL_TYPE=3 AND MBOX_NO=@SEL_VALUE THEN 1 
			   ELSE 0 
		  	END 
		group by scrap_code
		union ALL 
		select  'TOTAL' code,'Cell' 구분,'A',0 Cell_cnt
		union ALL
		select  'TOTAL' code,'Cell' 구분,'계',sum(수량) Cell_cnt
		from d23_MRUNBOX파일 a 
		where 1=1
			and a.End_time >= @시작일자+' 000000'
			and a.End_time <= @종료일자+' 235959'
			and BEF_RUNNO like coalesce(nullif(@제품유형,''),'%')+'%'
			and 1=CASE WHEN @SEL_VALUE='' THEN 1
			   WHEN @SEL_TYPE=1 AND BEF_RUNNO=@SEL_VALUE THEN 1
			   WHEN @SEL_TYPE=2 AND CELL_NO=@SEL_VALUE THEN 1 
			   WHEN @SEL_TYPE=3 AND MBOX_NO=@SEL_VALUE THEN 1 
			   ELSE 0 
		  	END 
	) AS SourceTable
	PIVOT
    (
      sum(Cell_cnt)
      FOR scrap_code IN ([계], [A], [U], [C], [F], [P], [M], [G], [I], [R], [E])
	) AS Pivot6  
 )