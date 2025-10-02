CREATE FUNCTION Get_내포장실적_설비이물제거Auto_Pack관리
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
	WITH RankedRunNo AS (
	    SELECT 
	        pack_no,
	        run_no,
	        cell수량,
	        ROW_NUMBER() OVER (PARTITION BY pack_no ORDER BY run_no) AS rn
	    FROM 
	        Get_내포장실적_설비이물제거Auto(@from_yyyymmdd , @to_yyyymmdd, @구분)
--	        Get이물제거Auto(@from_yyyymmdd , @to_yyyymmdd, @구분)
	)    
	select x.*, run_no1, cell수량1, run_no2, cell수량2, run_no3, cell수량3, run_no4, cell수량4, run_no5, cell수량5, run_no6, cell수량6, run_no7, cell수량7, run_no8, cell수량8, run_no9, cell수량9, run_no10, cell수량10, run_no11, cell수량11, run_no12, cell수량12, run_no13, cell수량13, run_no14, cell수량14, run_no15, cell수량15, run_no16, cell수량16, run_no17, cell수량17, run_no18, cell수량18, run_no19, cell수량19, run_no20, cell수량20
	from
	(
		select *
		from
		(
			select 발행횟수, PACK상태, 
	--			   case when pack상태 = '폐기' then '폐기분'
	--		            when pack상태 = 'SI 대기' then '생성분'
	--		            when nullif(발행자,'') is null and nullif(승인자,'') is null and pack상태 != '폐기' then '미생성분'
	--		            else 'ETC'
	--			   end 구분,
			       특이사항,
			       Start_time 생성시각, pack_qrno, 대포장_qrno, 유효기간, 유효일자, cell수량, 발행자
			       ,폐기사유
			from d27_내포장MST a 
	--		left join  d39_공정별특이사항파일 b 
	--		on a.pack_qrno = b.관리번호
			where 1=1
	--		and b.공장코드 = '2' and b.공정코드 = ''
			--AND PACK_QRNO = 'LJ9707720AE1DLD2N1OCU000006090'
			and substring(Start_time,1,8) between @from_yyyymmdd and @to_yyyymmdd
			--and nullif(SI_등록일자,'') is not null 
			and 발행구분 = 'AUTO'
		) a
	--	where 구분 = '생성분'
	--	and pack상태 != '폐기'
	) x left join 
	(
		SELECT
		    pack_no,
		    MAX(CASE WHEN rn =  1 THEN run_no END) AS run_no1 ,
		    MAX(CASE WHEN rn =  1 THEN cell수량 END) AS cell수량1,
		    MAX(CASE WHEN rn =  2 THEN run_no END) AS run_no2 ,
		    MAX(CASE WHEN rn =  2 THEN cell수량 END) AS cell수량2,
		    MAX(CASE WHEN rn =  3 THEN run_no END) AS run_no3 ,
		    MAX(CASE WHEN rn =  3 THEN cell수량 END) AS cell수량3,
		    MAX(CASE WHEN rn =  4 THEN run_no END) AS run_no4 ,
		    MAX(CASE WHEN rn =  4 THEN cell수량 END) AS cell수량4,
		    MAX(CASE WHEN rn =  5 THEN run_no END) AS run_no5 ,
		    MAX(CASE WHEN rn =  5 THEN cell수량 END) AS cell수량5,
		    MAX(CASE WHEN rn =  6 THEN run_no END) AS run_no6 ,
		    MAX(CASE WHEN rn =  6 THEN cell수량 END) AS cell수량6,
		    MAX(CASE WHEN rn =  7 THEN run_no END) AS run_no7 ,
		    MAX(CASE WHEN rn =  7 THEN cell수량 END) AS cell수량7,
		    MAX(CASE WHEN rn =  8 THEN run_no END) AS run_no8 ,
		    MAX(CASE WHEN rn =  8 THEN cell수량 END) AS cell수량8,
		    MAX(CASE WHEN rn =  9 THEN run_no END) AS run_no9 ,
		    MAX(CASE WHEN rn =  9 THEN cell수량 END) AS cell수량9,
		    MAX(CASE WHEN rn = 10 THEN run_no END) AS run_no10,
		    MAX(CASE WHEN rn = 10 THEN cell수량 END) AS cell수량10,
		    MAX(CASE WHEN rn = 11 THEN run_no END) AS run_no11,
		    MAX(CASE WHEN rn = 11 THEN cell수량 END) AS cell수량11,
		    MAX(CASE WHEN rn = 12 THEN run_no END) AS run_no12,
		    MAX(CASE WHEN rn = 12 THEN cell수량 END) AS cell수량12,
		    MAX(CASE WHEN rn = 13 THEN run_no END) AS run_no13,
		    MAX(CASE WHEN rn = 13 THEN cell수량 END) AS cell수량13,
		    MAX(CASE WHEN rn = 14 THEN run_no END) AS run_no14,
		    MAX(CASE WHEN rn = 14 THEN cell수량 END) AS cell수량14,
		    MAX(CASE WHEN rn = 15 THEN run_no END) AS run_no15,
		    MAX(CASE WHEN rn = 15 THEN cell수량 END) AS cell수량15,
		    MAX(CASE WHEN rn = 16 THEN run_no END) AS run_no16,
		    MAX(CASE WHEN rn = 16 THEN cell수량 END) AS cell수량16,
		    MAX(CASE WHEN rn = 17 THEN run_no END) AS run_no17,
		    MAX(CASE WHEN rn = 17 THEN cell수량 END) AS cell수량17,
		    MAX(CASE WHEN rn = 18 THEN run_no END) AS run_no18,
		    MAX(CASE WHEN rn = 18 THEN cell수량 END) AS cell수량18,
		    MAX(CASE WHEN rn = 19 THEN run_no END) AS run_no19,
		    MAX(CASE WHEN rn = 19 THEN cell수량 END) AS cell수량19,
		    MAX(CASE WHEN rn = 20 THEN run_no END) AS run_no20,
		    MAX(CASE WHEN rn = 20 THEN cell수량 END) AS cell수량20
		FROM 
		    RankedRunNo
		GROUP BY 
		    pack_no
	) y
	on x.pack_qrno = y.pack_no
);
