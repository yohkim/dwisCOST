CREATE Procedure Get_출하대기List (
	@시작일  VARCHAR(8),
 	@종료일  VARCHAR(8)
 )
AS
BEGIN
	BEGIN TRY
		BEGIN TRANSACTION;
		DECLARE @Columns VARCHAR(3000);
		DECLARE @Null_Columns VARCHAR(3000);
		DECLARE @SQL NVARCHAR(4000);
		-- PIVOT할 열 목록 조회
		SELECT @Columns = COALESCE(@Columns + '], [', '') + model
		FROM (SELECT DISTINCT TOP 500 substring(run_id,1,4) model  
				from d27_내포장MST 
			   where PACK상태 in ('창고 재고','출하 완료') 
				and (  (폐기시각 BETWEEN @시작일 + ' 000000' AND @종료일+ ' 235959' AND pack상태 = '폐기') 
				    OR (출하작업시각 BETWEEN @시작일 + ' 000000' AND @종료일+ ' 235959' AND pack상태 = '출하 완료') 
				    OR (대기작업시각 BETWEEN @시작일 + ' 000000' AND @종료일+ ' 235959' AND pack상태 = '창고 재고') 
				    OR (반출시각 BETWEEN @시작일 + ' 000000' AND @종료일+ ' 235959' AND pack상태 = '소포장 반출') 
				    OR (SI_의뢰시각 BETWEEN @시작일 + ' 000000' AND @종료일+ ' 235959' AND pack상태 = 'SI 의뢰') 
				    OR (SI_등록일자 BETWEEN @시작일  AND @종료일 AND pack상태 = 'SI LIST') 
				    OR (처리시각 BETWEEN @시작일 + ' 080000' AND dbo.AddOneDayAndTime(@종료일) AND pack상태 = 'SI 대기'))
			  ORDER BY 1 )AS models ;
			select @Columns=  '['+@Columns+']';
		SELECT @Null_Columns = COALESCE(@Null_Columns, '') + model +'],0) as ['+model+'],coalesce([' 
		FROM (SELECT DISTINCT TOP 500 substring(run_id,1,4) model  
				from d27_내포장MST where PACK상태 in ('창고 재고','출하 완료')
				and (  (폐기시각 BETWEEN @시작일 + ' 000000' AND @종료일+ ' 235959' AND pack상태 = '폐기') 
				    OR (출하작업시각 BETWEEN @시작일 + ' 000000' AND @종료일+ ' 235959' AND pack상태 = '출하 완료') 
				    OR (대기작업시각 BETWEEN @시작일 + ' 000000' AND @종료일+ ' 235959' AND pack상태 = '창고 재고') 
				    OR (반출시각 BETWEEN @시작일 + ' 000000' AND @종료일+ ' 235959' AND pack상태 = '소포장 반출') 
				    OR (SI_의뢰시각 BETWEEN @시작일 + ' 000000' AND @종료일+ ' 235959' AND pack상태 = 'SI 의뢰') 
				    OR (SI_등록일자 BETWEEN @시작일  AND @종료일 AND pack상태 = 'SI LIST') 
				    OR (처리시각 BETWEEN @시작일 + ' 080000' AND dbo.AddOneDayAndTime(@종료일) AND pack상태 = 'SI 대기'))
			  ORDER BY 1 )AS models ;
			select @Null_Columns=  '상태,구분,'+ replace('coalesce(['+@Null_Columns+']',',coalesce([]','');
-- 동적 SQL 생성
SET @SQL = '
SELECT 
    '+ @Null_Columns +'
FROM
    (select substring(run_id,1,4) MODEL,CASE when PACK상태=''창고 재고'' then ''출하 대기'' else PACK상태 end as 상태,''Pack'' 구분,coalesce(count(*),0) Pack
	  from d27_내포장MST 
	 where PACK상태 in (''창고 재고'',''출하 완료'')
				  and ((폐기시각 BETWEEN '''+ @시작일 + '''+'' 000000'' AND ''' +@종료일+ '''+'' 235959'' AND pack상태 = ''폐기'') 
				    OR (출하작업시각 BETWEEN '''+ @시작일 + '''+'' 000000'' AND '''+@종료일+ '''+'' 235959'' AND pack상태 = ''출하 완료'') 
				    OR (대기작업시각 BETWEEN '''+@시작일 + '''+'' 000000'' AND '''+@종료일+ '''+'' 235959'' AND pack상태 = ''창고 재고'') 
				    OR (반출시각 BETWEEN '''+@시작일 + '''+'' 000000'' AND '''+@종료일+ '''+'' 235959'' AND pack상태 = ''소포장 반출'') 
				    OR (SI_의뢰시각 BETWEEN '''+@시작일 + '''+'' 000000'' AND '''+@종료일+ '''+'' 235959'' AND pack상태 = ''SI 의뢰'') 
				    OR (SI_등록일자 BETWEEN '''+@시작일 + ''' AND '''+ @종료일 +''' AND pack상태 = ''SI LIST'') 
				    OR (처리시각 BETWEEN '''+@시작일 + '''+'' 080000'' AND dbo.AddOneDayAndTime('''+@종료일+''') AND pack상태 = ''SI 대기''))
		group by PACK상태,substring(run_id,1,4)
		UNION ALL 
	select substring(run_id,1,4) MODEL,CASE when PACK상태=''창고 재고'' then ''출하 대기'' else PACK상태 end as 상태,''Cell'',coalesce(SUM(CELL수량),0) Pack
	from d27_내포장MST 
 	where PACK상태 in (''창고 재고'',''출하 완료'')
				   and ((폐기시각 BETWEEN '''+ @시작일 + '''+'' 000000'' AND ''' +@종료일+ '''+'' 235959'' AND pack상태 = ''폐기'') 
				    OR (출하작업시각 BETWEEN '''+ @시작일 + '''+'' 000000'' AND '''+@종료일+ '''+'' 235959'' AND pack상태 = ''출하 완료'') 
				    OR (대기작업시각 BETWEEN '''+@시작일 + '''+'' 000000'' AND '''+@종료일+ '''+'' 235959'' AND pack상태 = ''창고 재고'') 
				    OR (반출시각 BETWEEN '''+@시작일 + '''+'' 000000'' AND '''+@종료일+ '''+'' 235959'' AND pack상태 = ''소포장 반출'') 
				    OR (SI_의뢰시각 BETWEEN '''+@시작일 + '''+'' 000000'' AND '''+@종료일+ '''+'' 235959'' AND pack상태 = ''SI 의뢰'') 
				    OR (SI_등록일자 BETWEEN '''+@시작일 + ''' AND '''+ @종료일 +''' AND pack상태 = ''SI LIST'') 
				    OR (처리시각 BETWEEN '''+@시작일 + '''+'' 080000'' AND dbo.AddOneDayAndTime('''+@종료일+''') AND pack상태 = ''SI 대기''))
		 group by PACK상태,substring(run_id,1,4)
) AS SourceTable
PIVOT 
(
    SUM(PACK)
    FOR MODEL IN (' + @Columns + ')
) AS PivotTable
order by 1,2 desc;';

-- 동적 SQL 실행
--select @SQL;
		EXEC sp_executesql @SQL;
		COMMIT TRANSACTION;
	END TRY
	
	BEGIN CATCH
	    ROLLBACK TRANSACTION;
	    SELECT ERROR_MESSAGE() AS ErrorMessage;
	END CATCH;
END;