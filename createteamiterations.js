tau.mashups
 .addDependency('libs/jquery/jquery')
 .addMashup(function ($, config) {
        var teams = { };
	function getTeamIterations(handleData) {
          var now = new Date();
          $.ajax({
                          type: 'GET',
      			  async: false,
                          url: '/api/v1/TeamIterations?format=json&where=EndDate%20gte%20' + now.format("m-d-Y")+ '&take=1000&orderBy=EndDate',
                          contentType: 'application/json',
                          dataType: 'json',
                          success: function(resp) {
                               handleData(resp); 
                          }
                                     
              });
        }

 
        function getTeams(handleData) {
 
       
        
          $.ajax({
                          type: 'GET',
      			  async: false,              
                          url: '/api/v1/Teams?format=json',
                          contentType: 'application/json',
                          dataType: 'json',
                          success: function(resp) {
                               handleData(resp); 
                          }
                                     
              });
        }
        
                                  
    $('.user-sub').append('<button id = "aa">AA</button>');
    
    
    function buildContent(){
     	$('#content').html('');
	//build a list of the teams, probably build from team/project selector in tp3	                              
  	
    
        //var teams = { team : [] };
    	
        
        
      	getTeams(function(output){
                
        	var teamitem;                
        	$.each(output.Items, function(key,item){
	            	teamitem = {
                                    Name: item.Name,
                                    LastEnd : null,
                                    StartDate: null
                                    };
                       teams[item.Id] = teamitem;
                       

                });
        	
                          
                          
    	});
        
        
    
	

      	getTeamIterations(function(output){
                	
        	console.log("the team iterations");
        	
        	
        	var enddate;
              
        	$.each(output.Items, function(key,item){
                                                        
		     enddate = new Date(parseInt(item.EndDate.substr(6)));
                     teams[item.Team.Id].LastEnd = enddate;
          
            
                });
        	
               
                          
    	});
    	
        
        var iterationstable = $('<BR><table width= 500></table>');
	iterationstable.append($('<tr><th colspan = 4; width= 400 align = "left">Team Iterations</th></tr>'));
    	iterationstable.append($('<tr><th> </th><th align = "left">Team</th><th align = "left">Last End</th><th align = "left">Next Start</th></tr>'));
    
    
    	console.log(teams);
	$.each(teams, function(key,item){
	
                console.log('New Team');
                console.log(teams[key]);
            	enddate = teams[key].LastEnd;
		
                if(enddate !== null){
                        //have our next sprint start after our current sprint             
                	enddate = enddate.format("m-d-Y");                     
			startdate = new Date(enddate);
                  	startdate.setDate(startdate.getDate() + 1);
                      	//have our object remember the new start date
                        console.log(startdate);
                    	teams[key].StartDate = startdate;
                        //now make it a string for display
                        startdate =  startdate.format("m-d-Y");
                        
                }else{
                	enddate = "n/a";
                  	startdate = new Date();
                  	teams[key].StartDate = startdate;
                        startdate =  startdate.format("m-d-Y");
		}
                var tr = $('<tr></tr>');
                
          	tr.append($('<td><input type="checkbox" name="' + key + '" value="' + key + '" checked></td><td align = "left">' + teams[key].Name + '</td><td align = "left">' + enddate  + '</td>'));
                tr.append($('<td align = "left">' + startdate  + '</td>').click(function(){
			console.log('woo');
                                                                                
                                                                                
                }));
                
  
                iterationstable.append(tr);                              
		
               
               
        });
        
        $('#content').append(iterationstable);
        $('#content').append('<BR><BR><BR>');
        
        
        
 }
    
    
    
    $('#aa').click(function(){
        $('#aa').hide();                      

    	buildContent();
    
    
    	$('#a').show();     
    
    	return false;
    });
                                  
    $('.user-sub').append('<div id = "a"><div id = "content"></div><div id = "buttons" align = "left"></div></div>');                                   
    $('#a').css( "position", "absolute" );
    $('#a').css( "width", "600" );
    $('#a').css( "height", "300" );
//  $('#a').css("","");
    $('#a').css("top","2");
    $('#a').css("left","2");
    $('#a').css( "background-color", "#FFFFFF" );
    $('#a').hide();
    
    $('#buttons').append('<button id ="click">Click Me!</button><button id ="close">Close</button>');
    
    
    $('#click').click(function(){
    
                                                        
           

            	
            $.each(teams, function(key,item){

  
        	var postdata = {};
                
                postdata.StartDate = teams[key].StartDate;
        	enddate = new Date(teams[key].StartDate);
                
                postdata.Name = teams[key].Name + ' (' + teams[key].StartDate.format("m-d-Y") + ') Iteration';
                enddate.setDate(enddate.getDate() + 14);
                postdata.EndDate = enddate;
                
                postdata.Team  = {Id : key};
                console.log('postdata');
                console.log(postdata);                                     
                                                   
                 $.ajax({ 
                                  type: 'POST', 
                                  url: '/api/v1/teamiterations', 
                                  dataType: 'json',
                                  processData: false,
                                  async: false,
                                  contentType: 'application/json',
                                  data: JSON.stringify(postdata), 
                                  success: function(){ console.log("yay!");}, 
                                  error: function(){console.log("boo!");}
                  }); 
                  
              });     
              
              buildContent();
              return false;
    	
                                                                   
    });
  
	 $('#close').click(function(){
	 
         	$('#a').hide();
    		$('#aa').show();
      		return false;
                           
         });
  
  
   
  });