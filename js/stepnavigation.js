/***
*	This plugin is used to create the Step navigation UI when we have multistep process. 
*	It gives the flexibality to go to next / previous steps and in progress steps by calling predefined methods.
* 	
*	How to use this plugin?
* 	> Create Object of our plugin 
*		var stepnavigator = new StepNavigatorUI(id, steps, configData);
*		@param {number} container - stepnavigation UI selector id or class Ex: #stepnavigator or .stepnavigator
*		@param {number} steps - no of steps need to show in UI
*		@param {number} configData - json data for customized data
*		configData = {
*	  		nodesize : "50",
*	  		progressbarheight : "10"
*	  	}
*	  	@param {number} nodeSize - step node width 
*	  	@param {number} progressbarheight - height of the progressbar
***/
(function() {
  	
  	var STATUS_INACTIVE = 0;
  	var STATUS_INPROGRESS = 1;
  	var STATUS_ACTIVE = 2;
  	var STATUS_RESET = 3;

  	// Define our constructor
  	this.StepNavigatorUI = function(container,steps,configData) {
	  	console.log("StepNavigatorUI Plugin intialized");
	  	this.containerID = container;
  		this.navigatorContainer = null;
		this.containerWidth = this.containerHeight = this.nodeSze = this.progressbarSize = this.progressbarHeight = this.steps = 0;
		this.configData = configData;
		this.inProgress - false;
		this.currentStep = 1;
		this.activeColor = "#00B050";
		this.inactiveColor = "#EEECE1";
		this.inprogressColor = "#FF9800"
		this.animationDuration = "0.5s";
  		this.navigatorContainer = document.querySelector(container);
  		this.setStepNodeSizes(steps,configData);
	  	this.createStepNodes(steps);
	  	this.configureCSS();
  	};

  	StepNavigatorUI.prototype.setStepNodeSizes = function(steps){

  		console.log(document.body.offsetWidth+"---"+document.getElementById('stepnavigation').offsetWidth);
  		this.containerWidth = (this.navigatorContainer.offsetWidth*0.9);
  		this.containerHeight = this.navigatorContainer.offsetHeight;
  		this.steps = steps;

  		this.nodeSze = (this.containerWidth)/(this.steps+((this.steps-1)*2));
  		this.progressbarHeight = (this.nodeSze*0.1);

  		if((typeof(this.configData)!=="undefined")){
  			if((typeof(this.configData["nodesize"]))!=="undefined"){
  				this.nodeSze = this.configData["nodesize"];
  			}

  			if((typeof(this.configData["progressbarheight"]))!=="undefined"){
  				this.progressbarHeight = this.configData["progressbarheight"];
  			}
  		}

		this.progressbarSize = ((this.containerWidth) - (this.nodeSze*this.steps))/(this.steps-1);
  	};

	StepNavigatorUI.prototype.createStepNodes = function(steps){
	  	
	  	for (var i = 1; i <= steps; i++) {
	  		this.createCircleNode(i);
	  		if(steps!=i){
	  			this.stepProgressBar(i);
	  		}
	  	};
	};

	StepNavigatorUI.prototype.createCircleNode = function(id){
		var nodeElement = "<div class='stepNode"+(id==1?' activateStep':'')+"' id='stepNode-"+id+"'>"+id+"</div>";
		this.navigatorContainer.insertAdjacentHTML('beforeend', nodeElement);
		var marginleft = this.nodeSze*(id-1)+((this.progressbarSize)*(id-1));
		this.navigatorContainer.querySelector('#stepNode-'+id).style.marginLeft = marginleft+"px";
	};

	StepNavigatorUI.prototype.stepProgressBar = function(id){
		var progressnodeElement = "<div class='stepprogress' id='stepprogress-"+(id+1)+"'>&nbsp;</div>";
		this.navigatorContainer.insertAdjacentHTML('beforeend', progressnodeElement);
		var marginleft = this.nodeSze*(id)+((this.progressbarSize)*(id-1));
		this.navigatorContainer.querySelector('#stepprogress-'+(id+1)).style.marginLeft = marginleft+"px";
  	};

  	StepNavigatorUI.prototype.prev = function(){
  		if(this.inProgress==true){
  			this.updatestepActivity(this.currentStep+1,STATUS_RESET);
  		}
  		if(this.currentStep>1){
	  		this.updatestepActivity(this.currentStep,STATUS_INACTIVE);
	  		this.updateCurrentStep(false);
  		} else {
  			this.updatestepActivity(this.currentStep+1,STATUS_RESET);
  			console.log("already in 0th step");
  		}
  	};

  	StepNavigatorUI.prototype.next = function(status){
  		if(this.currentStep<this.steps){
	  		if((typeof(status)!="undefined") && (status!==true)){
	  			this.updatestepActivity(this.currentStep,STATUS_INPROGRESS);
	  		} else {
	  			this.updateCurrentStep(true);
	  			this.updatestepActivity(this.currentStep,STATUS_ACTIVE);
	  		}
  		} else {
  			console.log("already in last step")
  		}
  	};

  	StepNavigatorUI.prototype.updateCurrentStep = function(status){
		if(status==true){
			if(this.currentStep<this.steps){
				this.currentStep++;
			}
		} else if(status==false){
			if(this.currentStep>1){
				this.currentStep--;
			}
		}
  	};

  	StepNavigatorUI.prototype.updatestepActivity = function(stepno,status){
  		stepno = (status==1)?(stepno+1):stepno;
  		var progressbar = this.navigatorContainer.querySelector('#stepprogress-'+stepno);
  		var stepnode = this.navigatorContainer.querySelector('#stepNode-'+stepno);
  		var currentObj = this;
  		if(status==STATUS_INACTIVE){
  			stepnode.classList.add('inactivateStep');
			stepnode.classList.remove('activateStep');
  			setTimeout(function(){
  				progressbar.classList.add('inactivateStep');
  				progressbar.classList.remove('activateStep');
  				currentObj.inProgress = false;
  			},400);
  		} else if(status==STATUS_INPROGRESS){
  			progressbar.classList.remove('inactivateStep');
  			progressbar.classList.add('inprogressStep');
  			setTimeout(function(){
  				stepnode.classList.remove('inactivateStep');
  				stepnode.classList.add('inprogressStep');
  				currentObj.inProgress = true;
  			},400);
  		} else if(status==STATUS_ACTIVE){
  			progressbar.classList.remove('inactivateStep');
  			progressbar.classList.remove('inprogressStep');
  			progressbar.classList.add('activateStep');
  			setTimeout(function(){
  				stepnode.classList.remove('inactivateStep');
  				stepnode.classList.remove('inprogressStep');
  				stepnode.classList.add('activateStep');
  				currentObj.inProgress = false;
  			},400);
  		} else if(status==STATUS_RESET){
			stepnode.classList.remove('inactivateStep');
			stepnode.classList.remove('inprogressStep');
			stepnode.classList.remove('activateStep');
  			setTimeout(function(){
  				progressbar.classList.remove('inactivateStep');
	  			progressbar.classList.remove('inprogressStep');
	  			progressbar.classList.remove('activateStep');
	  			currentObj.inProgress = false;
  			},400);
  		}
  	};

  	StepNavigatorUI.prototype.configureCSS = function(){
  		var stepNavigatorCSS = "body{\
									margin: 0;\
									padding: 0;\
								}\
								"+this.containerID+" {\
									width: "+this.containerWidth+"px;\
									position: relative;\
									margin: auto;\
									height: 100px;\
								}\
								.stepNode{\
									float:left;\
									background: #EEECE1;\
									background-size: 200% 100%;\
								    transition: all "+this.animationDuration+";\
									text-align: center;\
									cursor:pointer;\
									position:absolute;\
									color: #000;\
									width:"+this.nodeSze+"px;\
									height:"+this.nodeSze+"px;\
									border-radius:"+this.nodeSze+"px;\
									line-height:"+this.nodeSze+"px;\
									font-size:"+ (this.nodeSze*0.5)+"px;\
								}\
								.stepprogress{\
									float:left;\
									position:absolute;\
									width:"+this.progressbarSize+"px;\
									height:"+this.progressbarHeight+"px;\
									background: #EEECE1;\
									background-size: 200% 100%;\
								    transition: all "+this.animationDuration+";\
									z-index:1000;\
									margin-top:"+((this.nodeSze/2)-(this.progressbarHeight/2))+"px;\
								}\
								.activateStep{\
									color: #FFF;\
									background-position: -100% 0;\
									background-image: linear-gradient(to right, "+this.inactiveColor+" 50%, "+this.activeColor+" 50%);\
								}\
								.inactivateStep{\
									color: #000;\
									background-position: 0% 0;\
									background-image: linear-gradient(to right, "+this.inactiveColor+" 50%, "+this.activeColor+" 50%);\
								}\
								.inprogressStep{\
									color: #000;\
									background-position: -100% 0;\
									background-image: linear-gradient(to right, "+this.inactiveColor+" 50%, "+this.inprogressColor+" 50%);\
								}";

		this.navigatorContainer.insertAdjacentHTML('beforeend','<style>'+stepNavigatorCSS+'</style>');
  	};
}());