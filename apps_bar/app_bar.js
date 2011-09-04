(function(config) {

  function init(){
    $j("#adomado-apps-trigger").hide();
    config.api.loadResources(["http://documentcloud.github.com/underscore/underscore-min.js", "http://documentcloud.github.com/backbone/backbone-min.js", "http://localhost/apps_bar.css"], setupBar);
  };

  function setupBar(){

    // model App
    var App = Backbone.Model.extend({

      initialize : function(){
      },

      defaults : function(){
        return {
          width : '32px',
          height : '32px'
        };
      }

    });




    // collection AppList
    var AppList = Backbone.Collection.extend({

      model : App,

      fetch : function(){
        var collection = this;
        $j(_adomado_prefs_apps).each(function(){
          var app = new App(this.app);
          collection.add(app);
        });
      }

    });



    // create new AppsList
    var Apps = new AppList;





    // view App
    var AppView = Backbone.View.extend({

      tagName : "div",

      template : _.template('<div class="apps-bar-app" id="<%= id %>">\
                                  <img title="<%= title %>" src="<%= icon_big %>">\
                               </div>'),

      events : {
        "click .apps-bar-app" : "appClicked"
      },

      initialize : function(){
        this.model.bind("change", this.render, this);
      },

      render : function(){
        $j(this.el).html(this.template(this.model.toJSON()));
        return this;
      },

      appClicked : function(event){
        var id = $j(event.target).parent().attr('id');
        $j('#app-'+ id +' > img').trigger('click');
      }

    });





    // view TriggerView
    var Trigger = Backbone.View.extend({

      tagName : "div",

      id : "adomado-apps-bar-trigger",

      events : {
        "mouseover #apps-bar-trigger-div" : "showBar"
      },

      render : function(){
        $j(this.el).html("<div id='apps-bar-trigger-div'>AppsBar</div>");
        return this;
      },

      showBar : function(){
        bar1.toggleBar();
        //window.setTimeout(bar1.toggleBar, 5000);
      }

    });






    // view BarView
    var BarView = Backbone.View.extend({
      

      tagName : "div",

      id : "adomado-apps-bar",


      events : {
        "click #adomado-apps-bar" : "toggleBar",
        "mouseover #apps-bar-more" : "showMore"
      },


      initialize : function(){

        var t = new Trigger;
        $j("body").append(t.render().el);

        this.render();

        Apps.bind("add", this.addOne, this);
        //Apps.bind("all", this.addAll, this);

        Apps.fetch();
      },   

      
      render : function(){
        $j(this.el).html("<div id='apps-bar-list'></div>").appendTo($j("body"));
        $j(this.el).append("<div id='apps-bar-more'>more..</div>");
      },
      

      addOne : function(app){
        console.log('addone');
        var view = new AppView({model : app});
        $j("#apps-bar-list").append(view.render().el);
      },


      addAll : function(){
        console.log('addall');
        Apps.each(this.addOne);
      },

      toggleBar : function(){
        var left = $j("#adomado-apps-bar").css('left') == "0px" ? "-100px" : "0px"
        $j("#adomado-apps-bar").animate({
          left : left
        }, 200);

        if(left == "0px") 
          $j("#adomado-apps-bar").one("mouseleave", this.toggleBar);

        $j('#apps-bar-list').css("margin-top", "0px")  
      },

      showMore : function(){
        $j('#apps-bar-list').animate({
          "margin-top" : "-=" + window.innerHeight
        }, 200);
      }

    });

    bar1 = new BarView;

  } // end init




  function options(){
    
  }


  config.api.callbacks({
    init : init,
    options : options,
  });



})({
  api : new IJAppApi.v1({appId : "__APP_ID__"})
});