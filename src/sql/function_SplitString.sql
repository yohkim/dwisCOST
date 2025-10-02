CREATE FUNCTION dbo.SplitString 
(
    @inputString NVARCHAR(MAX),
    @delimiter CHAR(1)
)
RETURNS @resultTable TABLE (Value NVARCHAR(MAX))
AS
BEGIN
    DECLARE @start INT = 1, @end INT;

    WHILE CHARINDEX(@delimiter, @inputString, @start) > 0
    BEGIN
        SET @end = CHARINDEX(@delimiter, @inputString, @start);
        INSERT INTO @resultTable(Value) 
        VALUES (SUBSTRING(@inputString, @start, @end - @start));
        SET @start = @end + 1;
    END;

    INSERT INTO @resultTable(Value)
    VALUES (SUBSTRING(@inputString, @start, LEN(@inputString) - @start + 1));

    RETURN;
END;
