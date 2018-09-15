
var Smile = (function() {

    // PRIVATE VARIABLES
        
    // The backend we'll use for Part 2. For Part 3, you'll replace this 
    // with your backend.
    // var apiUrl = 'https://smile451.herokuapp.com';  //Ruby on Rails backend
    var apiUrl = 'https://arslanay-warmup.herokuapp.com';    //Flask-Python backend
    //var apiUrl = 'http://localhost:5000'; //backend running on localhost

    // FINISH ME (Task 4): You can use the default smile space, but this means
    //            that your new smiles will be merged with everybody else's
    //            which can get confusing. Change this to a name that 
    //            is unlikely to be used by others. 
    var smileSpace = 'ryfSmiles'; // The smile space to use. 


    var smiles; // smiles container, value set in the "start" method below
    var smileTemplateHtml; // a template for creating smiles. Read from index.html
                           // in the "start" method
    var create; // create form, value set in the "start" method below


    // PRIVATE METHODS
      
   /**
    * HTTP GET request 
    * @param  {string}   url       URL path, e.g. "/api/smiles"
    * @param  {function} onSuccess   callback method to execute upon request success (200 status)
    * @param  {function} onFailure   callback method to execute upon request failure (non-200 status)
    * @return {None}
    */
   var makeGetRequest = function(url, onSuccess, onFailure) {
       $.ajax({
           type: 'GET',
           url: apiUrl + url,
           dataType: "json",
           success: onSuccess,
           error: onFailure
       });
   };

    /**
     * HTTP POST request
     * @param  {string}   url       URL path, e.g. "/api/smiles"
     * @param  {Object}   data      JSON data to send in request body
     * @param  {function} onSuccess   callback method to execute upon request success (200 status)
     * @param  {function} onFailure   callback method to execute upon request failure (non-200 status)
     * @return {None}
     */
    var makePostRequest = function(url, data, onSuccess, onFailure) {
        $.ajax({
            type: 'POST',
            url: apiUrl + url,
            data: JSON.stringify(data),
            contentType: "application/json",
            dataType: "json",
            success: onSuccess,
            error: onFailure
        });
    };
        
    /**
     * Insert smile into smiles container in UI
     * @param  {Object}  smile       smile JSON
     * @param  {boolean} beginning   if true, insert smile at the beginning of the list of smiles
     * @return {None}
     */
    var insertSmile = function(smile, beginning) {
        // Start with the template, make a new DOM element using jQuery
        var newElem = $(smileTemplateHtml);
        // Populate the data in the new element
        // Set the "id" attribute 
        newElem.attr('id', smile.id); 
        // Now fill in the data that we retrieved from the server
        newElem.find('.title').text(smile.title);
        // FINISH ME (Task 2): fill-in the rest of the data
        newElem.find('.Story').text(smile.story);
        newElem.find('.count').text(smile.like_count);
        newElem.find('.timestamp').text("Posted on " + smile.created_at);
        console.log(smile.created_at);

        if(smile.happiness_level == 1)
        {
            newElem.find('.happiness-level').addClass('happiness-level-1');
        }

        if(smile.happiness_level == 2)
        {
            newElem.find('.happiness-level').addClass('happiness-level-2');
        }

        if(smile.happiness_level == 3)
        {
            newElem.find('.happiness-level').addClass('happiness-level-3');
        }

        if (beginning) {
            smiles.prepend(newElem);
        } else {
            smiles.append(newElem);
        }
    };


     /**
     * Get recent smiles from API and display 10 most recent smiles
     * @return {None}
     */
    var displaySmiles = function() {
        // Prepare the AJAX handlers for success and failure
        var onSuccess = function(data) {
            /* Still need to figure out how to put most recent smile at beginning */
            for (i = 0; i < data.smiles.length; i++)
            {
                insertSmile(data.smiles[i], true);
            }

            console.log(data);
        };
        var onFailure = function() { 
            console.error('display smiles failed'); 
        };
        /* Finished: Get request correctly made */
        makeGetRequest("/api/smiles?space=ryfSmiles&count=10&order_by=created_at", onSuccess, onFailure);
    };

    /**
     * Add event handlers for clicking like.
     * @return {None}
     */
    var attachLikeHandler = function(e) {
        // Attach this handler to the 'click' action for elements with class 'like'
        smiles.on('click', '.like', function(e) {
            // Finished: Retrieves id of smile that is liked
            var smileId = $(e.target).parents('.smile').attr('id'); 
            // Prepare the AJAX handlers for success and failure
            var onSuccess = function(data) {
                // Finished: Like count is updated
                document.getElementById(smileId).querySelector('.count').textContent++;
            };
            var onFailure = function() { 
                console.error('like smile error'); 
            };
            // Finished: Request to like smile is sent to server
            makePostRequest("/api/smiles/"+smileId+"/like", null, onSuccess, onFailure);
        });
    };


    /**
     * Add event handlers for submitting the create form.
     * @return {None}
     */
    var attachCreateHandler = function(e) {
        // First, hide the form, initially 
        create.find('form').hide();

        // Finished: Upon clicking the share a smile button, the smile post page will be shown
        create.on('click', '#share-smile', function(e)
        {
            smiles.hide();
            create.find('form').show();
            create.find('#share-smile').hide();
        });

        // Finished: Upon clicking the cancel or post button, the smiles page will be shown
        create.on('click', '#cancel-button', function(e)
        {
            smiles.show();
            create.find('form').hide();
            create.find('#share-smile').show();
        });

        // The handler for the Post button in the form
        create.on('click', '#submit-input', function (e) {
            e.preventDefault (); // Tell the browser to skip its default click action

            var smile = {}; // Prepare the smile object to send to the server
            smile.title = create.find('.title-input').val();
            if(smile.title.length < 1 || smile.title.length > 64)
            {
                alert("Title must be greater than 0 characters and less than 64 characters\n");
                return;
            }
            // Finished: Smile data is collected and error checking implemented
            smile.story = create.find('.story-input').val();
            if(smile.story.length < 1 || smile.story.length > 2048)
            {
                alert("Story must be greater than 0 characters and less than 2048 characters\n");
                return;
            }

            smile.happiness_level = parseInt(create.find('select').val());
            if(smile.happiness_level < 1 || smile.happiness_level > 3)
            {
                alert("Happiness level must be greater than 0 and less than 3\n");
                return;
            }

            smile.like_count = 0;
            smile.space = smileSpace;

            var onSuccess = function(data) {
                // Finished: Smile is inserted at beginning
                insertSmile(data.smile, true);
                smiles.show();
                create.find('form').hide();
                create.find('#share-smile').show();
            };
            var onFailure = function() { 
                console.error('create smile failed'); 
            };
            
            // Finished: Post request correctly made
            makePostRequest("/api/smiles?space=ryfSmiles", smile, onSuccess, onFailure);
        });

    };

    
    /**
     * Start the app by displaying the most recent smiles and attaching event handlers.
     * @return {None}
     */
    var start = function() {
        smiles = $(".smiles");
        create = $(".create");

        // Grab the first smile, to use as a template
        smileTemplateHtml = $(".smiles .smile")[0].outerHTML;
        // Delete everything from .smiles
        smiles.html('');

        displaySmiles();
        attachLikeHandler();
        attachCreateHandler();
    };
    

    // PUBLIC METHODS
    // any private methods returned in the hash are accessible via Smile.key_name, e.g. Smile.start()
    return {
        start: start
    };
    
})();
