
CREATE PROCEDURE dbo.Lot_Create(
	@MODEL varchar(4),
	@PO_NO varchar(20),
	--@MODEL_CODE varchar(8),
	@WORK_CODE varchar(2),
	@거래처코드 varchar(5),
	--@제품Inch real,
	--@Lot_Sheet real,
	--@Lot_Block real,
	--@Lot_Cell real,
	@당일투입량 real,
	@Lot_시작 varchar(5),
	@생성수 real,
	@제품코드 varchar(6),
	@자재코드 varchar(6),
	@발행자 varchar(12),
	@승인자 varchar(12),
	@승인일자 varchar(8),
	@입고일자 varchar(8),
	@입고시각 varchar(6),
	@작업일자 varchar(8),
	@작업시각 varchar(6),
	@특기사항 varchar(100)
)
AS
BEGIN
	BEGIN TRY
	   BEGIN TRANSACTION;  
		DECLARE @실행결과 varchar(150);
		DECLARE @투입구분 varchar(1)  =(select substring(내용,2,1)  from d02_일반코드파일 where 대분류='31' AND 코드=@WORK_CODE);
		DECLARE @수주번호 varchar(4) = FORMAT(cast(substring(@PO_NO,15,4) as int),'0000');
		declare @작업지시일자 varchar(8) = @입고일자;
		declare @Lot_Seq int = CAST(substring(@Lot_시작,2,4) as int);
		DECLARE @YYMM varchar(6) = substring(CONVERT(VARCHAR(10), GETDATE(), 112),3,4);
		DECLARE @MODEL_CODE varchar(8);
		DECLARE @제품Inch real;
		DECLARE @Lot_Sheet real;
		DECLARE @Lot_Block real;
		DECLARE @Lot_Cell real
		
		SELECT @MODEL_CODE=CODE FROM dw_model_mast WHERE model=@MODEL;
		SELECT @제품Inch=Inch, @Lot_Sheet=Sheet,@Lot_Block=Block,@Lot_Cell=Cell FROM dw_product_mast where prod_code=@제품코드;
	
	   INSERT INTO d21_제조지시MST 
	   (공장코드,LOT_NO,PO_NO,수주번호,RUN_CELL1,RUN_CELL2,작업지시일자,제품유형,투입구분,작업구분,거래처코드,제품코드,제품_inch,자재코드,적층수,Sheet,BLOCK수,CELL수,RawGlass,EtchGlass
	   ,당일투입량,지시수량,지시잔량,시작LOT_NO,생성수량,잔여량,발행자,발행자서명,승인자,승인자서명,승인일자,입고일자,입고시각,작업일자,작업시각,작업수량,Etching_Rate,생산완료여부,출력횟수,재공적용_여부,특기사항)
		SELECT	'2' 공장코드,	--공장코드
			@MODEL || 'F' || @YYMM || '-P' ||  FORMAT(@Lot_Seq + seq ,'0000') LOT_NO,
			@PO_NO PO_NO,
			@수주번호 수주번호, --@수주번호 수주번호,
			0 RUN_CELL1,
			0 RUN_CELL2,
			@작업지시일자 작업지시일자, --@작업지시일자 작업지시일자,
			@MODEL_CODE 제품유형,
			@투입구분 투입구분, --(select substring(내용,2,1)  from d02_일반코드파일 where 대분류='31' AND 코드=@WORK_CODE) 투입구분,--@투입구분 투입구분,
			@WORK_CODE 작업구분,
			@거래처코드 거래처코드,
			@제품코드 제품코드,
			@제품Inch 제품_Inch,
			@자재코드 자재코드,
			0 적층수,
			@Lot_Sheet Sheet,
			@Lot_Block Vlock,
			@Lot_Cell Cell,
			1 RawGlass,
			0 EtchGlass,
			@당일투입량 당일투입량,
			@Lot_Cell 지시수량,
			0 지시잔량,
			@Lot_시작 시작LOT_NO,
			@생성수 생성수량,
			0 잔여량,
			@발행자 발행자,
			1 발행자서명,
			@승인자 승인자,
			1 승인자서명,
			@승인일자 승인일자,
			@입고일자 입고일자,
			@입고시각 입고시각,
			@작업일자 작업일자,
			@작업시각 작업시각,
			0 작업수량,
			0 Etching_Rate,
			0 생산완료여부,
			0 출력횟수,
			1 재공적용_여부,
			@특기사항 특기사항 
		from
			dw_copy
		where
			seq between 0 and @생성수-1; --1에서 LOT생성의 생성수(10) 까지
			
		DECLARE @LOT마스터 VARCHAR(4) = CAST(@@ROWCOUNT AS VARCHAR(4));
	
		DECLARE @PROCESS_ID VARCHAR(7);
		SELECT	@PROCESS_ID = process_id from	dw_product_process	where Prod_code = @제품코드;
	
		INSERT INTO d21_제조지시VLR
		(공장코드,LOT_NO,공정코드,순서,작업구분,투입수량,검사수량,불량수량,양품수량,CELL수량,재공적용_여부)
		select 2 공장코드,
				@MODEL || 'F' || @YYMM || '-P' ||  FORMAT(@Lot_Seq + seq ,'0000') LOT_NO,
					공정코드,
					순서,
				1	작업구분,
				0	투입수량,
				0	검사수량,
				0	불량수량,
				0	양품수량,
				0	CELL수량,
				1	재공적용_여부
		from v_dw_process_plan a 
		inner join dw_copy b on (seq between 0 and @생성수-1)
		where line='DFB1' and process_Id=@PROCESS_ID and 공정구분='09';
	
		DECLARE @LOT_HIST VARCHAR(4) = CAST(@@ROWCOUNT AS VARCHAR(4));
		
		COMMIT TRANSACTION;
		SELECT 'SUCCESS : LOT마스터 테이블(d21_제조지시MST) '||@LOT마스터||'건, LOT HISTORY (d21_제조지시VLR)'||@LOT_HIST||'건 입력 되었습니다' AS Message;
	
	END TRY
	
	BEGIN CATCH
	    ROLLBACK TRANSACTION;
	   
	    SELECT ERROR_MESSAGE() AS ErrorMessage;
	END CATCH;
END;