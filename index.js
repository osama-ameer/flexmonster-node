var express = require('express');
var app = express();
const compressor = require('flexmonster-compressor')
const cors = require('cors')


app.use(cors())
app.use(express.json())
app.get('/', function (req, res) {
   
    var sql = require("mssql");
  
    // config for your database
    var config = {
        user: 'osamaameer',
        password: 'osama',
        server: 'localhost', 
        database: 'FlexMonster' ,
        options: {
            trustServerCertificate: true,
          }
    };

    // connect to your database
    sql.connect(config, function (err) {
    
        if (err) console.log(err.message);

        // create Request object
        var querySql = ' select salesample.TeamName,  salesample.ProductName, null as M1,  mappingdata.BrickName_Major_Brick, mappingdata.BrickCode_MinorBrick from salesample right outer join mappingdata on salesample.BrickCode=mappingdata.BrickCode_MinorBrick UNION ALL select TeamName, ProductName,  M1 ,null as BrickName_Major_Brick, null as BrickCode_MinorBrick from jo  '
        var request = new sql.Request();
           
        // query to the database and get the records
        request.query( querySql , function (err, names) {
            
            if (err) console.log(err)

            // send records as a response
            // var result = names.stream()
            // let stream = compressor.compressJsonStream(result);
            // stream.on('data', data => res.write(data));
            // stream.on('end', () => res.end());
            res.send(names);
            // console.log(result)
            
            
        });
    });



});


app.get('/csv', (req, res) => {
    let stream = compressor.compressCsv(
    	`Category,Size,Color,Destination,Business Type,Country,Price,Quantity,Discount
		Accessories,262 oz,red,Australia,Specialty Bike Shop,Australia,174,225,23
		Bikes,214 oz,yellow,Canada,Specialty Bike Shop,Canada,502,90,17
		Clothing,147 oz,white,France,Specialty Bike Shop,France,242,855,37
		Components,112 oz,yellow,Germany,Specialty Bike Shop,Germany,102,897,42
		Cars,256 oz,red,United Kingdom,Specialty Bike Shop,United Kingdom,126,115,44
		Clothing,8 oz,green,Australia,Value Added Reseller,Australia,680,66,80`
	);
    stream.on('data', data => res.write(data));
    stream.on('end', () => res.end());
})

var server = app.listen(5000, function () {
    console.log('Server is running.. 5000');
});

