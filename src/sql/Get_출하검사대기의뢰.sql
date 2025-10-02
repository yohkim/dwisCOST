
CREATE Procedure Get_출하검사대기의뢰 (
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
				from d27_내포장MST where PACK상태 in ('SI 의뢰','SI 대기') and 발행일자 BETWEEN @시작일 and @종료일 
			  ORDER BY 1 )AS models ;
			select @Columns=  '[합계],'+'['+@Columns+']';
		SELECT @Null_Columns = COALESCE(@Null_Columns, '') + model +'],0) as ['+model+'],coalesce([' 
		FROM (SELECT DISTINCT TOP 500 substring(run_id,1,4) model  
				from d27_내포장MST where PACK상태 in ('SI 의뢰','SI 대기') and 발행일자 BETWEEN @시작일 and @종료일 
			  ORDER BY 1 )AS models ;
			select @Null_Columns=  '상태,구분,합계,'+ replace('coalesce(['+@Null_Columns+']',',coalesce([]','');
-- 동적 SQL 생성
SET @SQL = '
SELECT 
    '+ @Null_Columns +'
FROM
    (select substring(run_id,1,4) MODEL,CASE when PACK상태=''SI 대기'' then ''출하검사 대기'' else ''출하검사의뢰'' end as 상태,''Pack'' 구분,coalesce(count(*),0) Pack
		from d27_내포장MST where PACK상태 in (''SI 의뢰'',''SI 대기'') and 
		발행일자 BETWEEN '+@시작일+' and '+@종료일+' group by PACK상태,substring(run_id,1,4)
	 UNION ALL
	 select ''합계'' MODEL,CASE when PACK상태=''SI 대기'' then ''출하검사 대기'' else ''출하검사의뢰'' end as 상태,''Pack'' 구분,coalesce(count(*),0) Pack
		from d27_내포장MST where PACK상태 in (''SI 의뢰'',''SI 대기'') and 
		발행일자 BETWEEN '+@시작일+' and '+@종료일+' group by PACK상태
	 UNION ALL
	 select substring(run_id,1,4) MODEL,CASE when PACK상태=''SI 대기'' then ''출하검사 대기'' else ''출하검사의뢰'' end,''Cell'',coalesce(SUM(CELL수량),0) Pack
		from d27_내포장MST where PACK상태 in (''SI 의뢰'',''SI 대기'') and 
		발행일자 BETWEEN '+@시작일+' and '+@종료일+' group by PACK상태,substring(run_id,1,4)
	 UNION ALL
	 select ''합계'' MODEL,CASE when PACK상태=''SI 대기'' then ''출하검사 대기'' else ''출하검사의뢰'' end,''Cell'',coalesce(SUM(CELL수량),0) Pack
		from d27_내포장MST where PACK상태 in (''SI 의뢰'',''SI 대기'') and 
		발행일자 BETWEEN '+@시작일+' and '+@종료일+' group by PACK상태
) AS SourceTable
PIVOT 
(
    SUM(PACK)
    FOR MODEL IN (' + @Columns + ')
) AS PivotTable
order by 1,2 desc;';

/*
select @SQL;
COMMIT TRANSACTION;
return;
*/

-- 동적 SQL 실행
		EXEC sp_executesql @SQL;
		COMMIT TRANSACTION;
	END TRY
	
	BEGIN CATCH
	    ROLLBACK TRANSACTION;
	    SELECT ERROR_MESSAGE() AS ErrorMessage;
	END CATCH;
END;