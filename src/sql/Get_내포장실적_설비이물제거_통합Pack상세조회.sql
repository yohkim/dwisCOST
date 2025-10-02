CREATE FUNCTION Get_내포장실적_설비이물제거_통합Pack상세조회
(
    @from_yyyymmdd varchar(10),
    @to_yyyymmdd  varchar(10),
    @pack상태 varchar(30),
    @AdjustMonth_from_yyyymmdd varchar(10),
    @Adjust_to_yyyymmdd  varchar(10)
)
RETURNS TABLE
AS
RETURN
(

    WITH  base_data AS
    (
        SELECT 
            발행구분, 
            y.pack상태, 
            CASE 
                WHEN y.pack상태 = '폐기' THEN y.폐기시각
                WHEN y.pack상태 = '출하 완료' THEN y.출하작업시각
                WHEN y.pack상태 = '창고 재고' THEN y.대기작업시각     
                WHEN y.pack상태 = '소포장 반출' THEN y.반출시각                
                WHEN y.pack상태 = 'SI 의뢰' THEN y.SI_의뢰시각    
                WHEN y.pack상태 = 'SI LIST' THEN y.SI_등록일자 + ' ' + y.SI_등록시각                
                WHEN y.pack상태 = 'SI 대기' THEN y.처리시각
            END AS 처리일시,
            CASE WHEN z.run_no IS NULL THEN y.run_id ELSE z.run_no END AS run_id, 
            CASE WHEN z.origin_no IS NULL THEN '' ELSE z.origin_no END AS origin_no, 
            CASE WHEN z.pack_no IS NULL THEN y.pack_qrno ELSE z.pack_no END AS pack_no,
            y.대포장_qrno AS box_no,
            CASE WHEN z.cell수량 IS NOT NULL THEN z.cell수량 ELSE cell수량x END AS cell수량,
            z.svi, z.agb, z.pfl, y.pallet_no, y.특이사항,
            pack수량x AS pack수량, cell수량x, run_id_cnt
        FROM
        (
            SELECT 
                발행구분,pack상태,run_id,pack_qrno,대포장_qrno,pallet_no,특이사항,폐기시각,출하작업시각,대기작업시각,반출시각,SI_의뢰시각,SI_등록일자,SI_등록시각,처리시각,
                COUNT(pack_qrno) OVER (PARTITION BY run_id, pack_qrno, Pack상태) AS pack수량x, 
                SUM(Cell수량) OVER (PARTITION BY pack_qrno, Pack상태) AS cell수량x,
                COUNT(*) OVER (PARTITION BY pack_qrno) AS run_id_cnt
            FROM d27_내포장MST x 
            WHERE 1=1
              AND ( 
                    run_id IN 
                    ( 
                        SELECT value 
                        FROM STRING_SPLIT(NULL, ';')
                    ) 
                    OR NULL IS NULL
                 )
              AND (
                    (폐기시각 BETWEEN @from_yyyymmdd + ' 080000' AND dbo.AddOneDayAndTime(@to_yyyymmdd) AND @pack상태 = '폐기') 
                    OR (출하작업시각 BETWEEN @from_yyyymmdd + ' 080000' AND dbo.AddOneDayAndTime(@to_yyyymmdd) AND @pack상태 = '출하 완료') 
                    OR (대기작업시각 BETWEEN @from_yyyymmdd + ' 080000' AND dbo.AddOneDayAndTime(@to_yyyymmdd) AND @pack상태 = '창고 재고' and 반출여부 = 1 and 출하대기여부 = 1 and 출하여부 = 0 ) 
                    OR (반출시각 BETWEEN @from_yyyymmdd + ' 080000' AND dbo.AddOneDayAndTime(@to_yyyymmdd) AND @pack상태 = '소포장 반출' and SI_의뢰여부 = 1 and 반출여부 = 1 and 출하대기여부 = 0) 
                    OR (SI_의뢰시각 BETWEEN @from_yyyymmdd + ' 080000' AND dbo.AddOneDayAndTime(@to_yyyymmdd) AND @pack상태 = 'SI 의뢰') 
                    OR (SI_등록일자 BETWEEN @from_yyyymmdd  AND dbo.AddOneDayAndTime(@to_yyyymmdd)  AND @pack상태 = 'SI LIST') 
                    OR (End_Time BETWEEN @from_yyyymmdd + ' 080000' AND dbo.AddOneDayAndTime(@to_yyyymmdd) AND @pack상태 = 'SI 대기' and SI_의뢰여부 = 0)
              ) 
            /*UNION
            SELECT case when substring(대포장_QRNO,23,1)='7' then 'MANUAL' else 'AUTO' end,pack상태,
            run_id,pack_qrno,대포장_qrno,pallet_no,특이사항,'' 폐기시각,'' 출하작업시각,대기처리시각,'' 반출시각,'' SI_의뢰시각,'' SI_등록일자,'' SI_등록시각,
            '' 처리시각,1 pack수량x,cell수량 cell수량x,1 run_id_cnt
            FROM d27_PALLET수불파일
            WHERE (대기처리시각 BETWEEN @from_yyyymmdd + ' 080000' AND dbo.AddOneDayAndTime(@to_yyyymmdd) AND @pack상태 = '창고 재고')*/              
        ) y
        LEFT JOIN 
        (	select null as run_no,null as origin_no,null as pack_no,null as cell수량,'' as svi,'' as agb,'' as pfl
        ) z
        ON 1=1
        AND y.pack_qrno = z.pack_no
    )
    SELECT distinct *
    FROM base_data
    WHERE (pack상태 = @pack상태 OR @pack상태 IS NULL)
)CREATE FUNCTION Get_내포장실적_설비이물제거_통합Pack상세조회
(
    @from_yyyymmdd varchar(10),
    @to_yyyymmdd  varchar(10),
    @pack상태 varchar(30),
    @AdjustMonth_from_yyyymmdd varchar(10),
    @Adjust_to_yyyymmdd  varchar(10)
)
RETURNS TABLE
AS
RETURN
(

    WITH  base_data AS
    (
        SELECT 
            발행구분, 
            y.pack상태, 
            CASE 
                WHEN y.pack상태 = '폐기' THEN y.폐기시각
                WHEN y.pack상태 = '출하 완료' THEN y.출하작업시각
                WHEN y.pack상태 = '창고 재고' THEN y.대기작업시각     
                WHEN y.pack상태 = '소포장 반출' THEN y.반출시각                
                WHEN y.pack상태 = 'SI 의뢰' THEN y.SI_의뢰시각    
                WHEN y.pack상태 = 'SI LIST' THEN y.SI_등록일자 + ' ' + y.SI_등록시각                
                WHEN y.pack상태 = 'SI 대기' THEN y.처리시각
            END AS 처리일시,
            CASE WHEN z.run_no IS NULL THEN y.run_id ELSE z.run_no END AS run_id, 
            CASE WHEN z.origin_no IS NULL THEN '' ELSE z.origin_no END AS origin_no, 
            CASE WHEN z.pack_no IS NULL THEN y.pack_qrno ELSE z.pack_no END AS pack_no,
            y.대포장_qrno AS box_no,
            CASE WHEN z.cell수량 IS NOT NULL THEN z.cell수량 ELSE cell수량x END AS cell수량,
            z.svi, z.agb, z.pfl, y.pallet_no, y.특이사항,
            pack수량x AS pack수량, cell수량x, run_id_cnt
        FROM
        (
            SELECT 
                발행구분,pack상태,run_id,pack_qrno,대포장_qrno,pallet_no,특이사항,폐기시각,출하작업시각,대기작업시각,반출시각,SI_의뢰시각,SI_등록일자,SI_등록시각,처리시각,
                COUNT(pack_qrno) OVER (PARTITION BY run_id, pack_qrno, Pack상태) AS pack수량x, 
                SUM(Cell수량) OVER (PARTITION BY pack_qrno, Pack상태) AS cell수량x,
                COUNT(*) OVER (PARTITION BY pack_qrno) AS run_id_cnt
            FROM d27_내포장MST x 
            WHERE 1=1
              AND ( 
                    run_id IN 
                    ( 
                        SELECT value 
                        FROM STRING_SPLIT(NULL, ';')
                    ) 
                    OR NULL IS NULL
                 )
              AND (
                    (폐기시각 BETWEEN @from_yyyymmdd + ' 080000' AND dbo.AddOneDayAndTime(@to_yyyymmdd) AND @pack상태 = '폐기') 
                    OR (출하작업시각 BETWEEN @from_yyyymmdd + ' 080000' AND dbo.AddOneDayAndTime(@to_yyyymmdd) AND @pack상태 = '출하 완료') 
                    OR (대기작업시각 BETWEEN @from_yyyymmdd + ' 080000' AND dbo.AddOneDayAndTime(@to_yyyymmdd) AND @pack상태 = '창고 재고' and 반출여부 = 1 and 출하대기여부 = 1 and 출하여부 = 0 ) 
                    OR (반출시각 BETWEEN @from_yyyymmdd + ' 080000' AND dbo.AddOneDayAndTime(@to_yyyymmdd) AND @pack상태 = '소포장 반출' and SI_의뢰여부 = 1 and 반출여부 = 1 and 출하대기여부 = 0) 
                    OR (SI_의뢰시각 BETWEEN @from_yyyymmdd + ' 080000' AND dbo.AddOneDayAndTime(@to_yyyymmdd) AND @pack상태 = 'SI 의뢰') 
                    OR (SI_등록일자 BETWEEN @from_yyyymmdd  AND dbo.AddOneDayAndTime(@to_yyyymmdd)  AND @pack상태 = 'SI LIST') 
                    OR (End_Time BETWEEN @from_yyyymmdd + ' 080000' AND dbo.AddOneDayAndTime(@to_yyyymmdd) AND @pack상태 = 'SI 대기' and SI_의뢰여부 = 0)
              ) 
            /*UNION
            SELECT case when substring(대포장_QRNO,23,1)='7' then 'MANUAL' else 'AUTO' end,pack상태,
            run_id,pack_qrno,대포장_qrno,pallet_no,특이사항,'' 폐기시각,'' 출하작업시각,대기처리시각,'' 반출시각,'' SI_의뢰시각,'' SI_등록일자,'' SI_등록시각,
            '' 처리시각,1 pack수량x,cell수량 cell수량x,1 run_id_cnt
            FROM d27_PALLET수불파일
            WHERE (대기처리시각 BETWEEN @from_yyyymmdd + ' 080000' AND dbo.AddOneDayAndTime(@to_yyyymmdd) AND @pack상태 = '창고 재고')*/              
        ) y
        LEFT JOIN 
        (	select null as run_no,null as origin_no,null as pack_no,null as cell수량,'' as svi,'' as agb,'' as pfl
        ) z
        ON 1=1
        AND y.pack_qrno = z.pack_no
    )
    SELECT distinct *
    FROM base_data
    WHERE (pack상태 = @pack상태 OR @pack상태 IS NULL)
)