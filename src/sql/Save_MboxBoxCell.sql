CREATE Procedure Save_MboxBoxCell (
	@CELL_LIST	varchar(500),
	@MBOX_NO    varchar(20),
	@등록자		varchar(20),
	@승인자		varchar(20),
	@RW구분	varchar(1)
)AS
BEGIN
	BEGIN TRY
	   BEGIN TRANSACTION;
	  
	 	IF EXISTS (SELECT * FROM d23_MRUNBOX파일 WHERE MBOX_NO=@MBOX_NO AND NULLIF(AFT_RUNNO,'') IS NOT NULL)
		BEGIN 
			SELECT @MBOX_NO||'는이미 M-RUN구성된 M-BOX입니다';
			COMMIT TRANSACTION;
			RETURN 1;
		END
		ELSE
		BEGIN
			MERGE INTO d23_MRUNBOX파일 AS mbox
			USING (	
					SELECT                                                                                                                   
						'2' 공장코드, --공장코드                                                                                                              
						a.cell_id,                                                                                     
						a.run_id,                                                                    
						c.설비약명 agb, --AGB                                                                                                      
						e.설비약명 pfl, --PFL_설비명                                                                                               
						d.TABLE_NO하 PFL_STAGE, --PFL_STAGE                                                                                              
						g.설비약명 이물_LINE, 	--이물_LINE                                                                                              
						a.특이사항                                                                                                  
					from d25_PFL외관검사파일 a                                                                                               
					left join d22_RUN제조VLR b on (a.run_id = b.run_no and b.공정코드 = '056')                                               
					left join d29_공정별설비파일 c on (b.Machine_Code = c.설비번호)                                                          
					left join d88_PFL공정LOG파일 d on (a.cell_id = d.cell_Id)                                                                
					left join d29_공정별설비파일 e on (d.설비호기 = e.설비번호)                                                              
					left join d26_FMRMachine_CellVaildInfo f on (a.cell_id = f.cell_Id)                                                      
					left join d29_공정별설비파일 g on (f.eqp_id = g.설비번호)                                                                
					where a.cell_id IN (SELECT value  from STRING_SPLIT(@CELL_LIST, ',')) 
				) AS n --new
			ON mbox.cell_no = n.cell_id
			WHEN MATCHED THEN 
			    UPDATE SET start_time = FORMAT(getdate(), 'yyyyMMdd HHmmss'),
			    		     End_Time = FORMAT(getdate(), 'yyyyMMdd HHmmss')
			WHEN NOT MATCHED THEN 
			     	INSERT (공장코드,MBOX_NO,CELL_NO,수량,BEF_RUNNO,등록자,등록여부,승인자,승인여부,start_time,end_time,AGB_호기명,
				  				PFL_설비명,PFL_STAGE,SCRAP_Code,이물_LINE,특이사항,저장여부,재공적용_여부)                                       
					VALUES ('2', --공장코드                                                                                                        
							@MBOX_NO,                                                                                                              
							n.cell_id,                                                                                                             
							1, --CELL 1개이기 때문에 수량은 1                                                                                      
							n.run_id,                                                                                                              
							@등록자,                                                                                                               
							1, --등록여부                                                                                                          
							@승인자,                                                                                                               
							1, --승인여부                                                                                                          
							FORMAT(getdate(), 'yyyyMMdd HHmmss'),  --start_time                                                                    
							FORMAT(getdate(), 'yyyyMMdd HHmmss'),  --end_time                                                                      
							n.agb, --AGB                                                                                                      
							n.pfl, --PFL_설비명                                                                                               
							n.pfl_stage, --PFL_STAGE                                                                                              
							@RW구분, --SCRAP_Code                                                                                                  
							n.이물_LINE, 	--이물_LINE                                                                                              
							n.특이사항,                                                                                                            
							1, --저장여부                                                                                                          
							1  --재공적용_여부 
							);
			COMMIT TRANSACTION;
			RETURN 0;
		END
	END TRY
	
	BEGIN CATCH
	    ROLLBACK TRANSACTION;
	    SELECT ERROR_MESSAGE() AS ErrorMessage;
	END CATCH;
END;