# Step-Navigaion-UI
This plugin is used to create the Step navigation UI when we have multistep process. 
It gives the flexibality to go to next / previous steps and in progress steps by calling predefined methods.
 	
How to use this plugin?


1) Create Empty Div with unique id
    
    <pre>
	<div id="stepnavigator">
       <!-- plug in will generate the Step Navigation Automatically once intiated from javascript -->
    </div>
	</pre>
 	
 2) Create Object of the plugin 
	
	var stepnavigator = new StepNavigatorUI(id, steps, configData);
	
	@param {number} container - stepnavigation UI selector id or class Ex: #stepnavigator or .stepnavigator
	@param {number} steps - no of steps need to show in UI
	@param {number} configData - json data for customized data
	configData = {
  		nodesize : "50",
  		progressbarheight : "10"
  		}
  		@param {number} nodeSize - step node width
  		@param {number} progressbarheight - height of the progressbar



  Methods to navigate through the steps\n
  1) stepnavigator.next() //TO go to next step
  2) stepnavigator.next(false) //To show next step as IN Progress
	3) stepnavigator.prev() //TO go to Previous Step
	

