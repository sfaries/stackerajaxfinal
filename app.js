$(document).ready( function() {
	$('.unanswered-getter').submit( function(event){
		// zero out results if previous search has run
		$('.results').html('');
		// get the value of the tags the user submitted
		var tags = $(this).find("input[name='tags']").val();
		getUnanswered(tags);
	});

	$('.inspiration-getter').submit( function(event){
		// zero out results if previous search and run
		$('.results').html('');
		// get the value of the tags the user submitted
		var tags = $(this).find("input[name='answerers']").val(); //changed from tags to answerers
		getAnswerer(tags);
	});
});

// this function takes the question object returned by StackOverflow 
// and creates new result to be appended to DOM
var showQuestion = function(question) {
	
	console.log(question);
	// clone our result template code
	var result = $('.templates .question').clone();
	
	// Set the question properties in result
	var questionElem = result.find('.question-text a');
	questionElem.attr('href', question.link);
	questionElem.text(question.title);

	// set the date asked property in result
	var asked = result.find('.asked-date');
	var date = new Date(1000*question.creation_date);
	asked.text(date.toString());

	// set the #views for question property in result
	var viewed = result.find('.viewed');
	viewed.text(question.view_count);

	// set some properties related to asker
	var asker = result.find('.asker');
	asker.html('<p>Name: <a target="_blank" href=http://stackoverflow.com/users/' + question.owner.user_id + ' >' +
													question.owner.display_name +
												'</a>' +
							'</p>' +
 							'<p>Reputation: ' + question.owner.reputation + '</p>'
	);

	return result;
};


// this function takes the results object from StackOverflow
// and creates info about search results to be appended to DOM
var showSearchResults = function(query, resultNum) {
	var results = resultNum + ' results for <strong>' + query;
	return results;
};

// takes error string and turns it into displayable DOM element
var showError = function(error){
	var errorElem = $('.templates .error').clone();
	var errorText = '<p>' + error + '</p>';
	errorElem.append(errorText);
};

// takes a string of semi-colon separated tags to be searched
// for on StackOverflow
var getUnanswered = function(tags) {
	
	// the parameters we need to pass in our request to StackOverflow's API
	var request = {tagged: tags,
								site: 'stackoverflow',
								order: 'desc',
								sort: 'creation'};
	
	var result = $.ajax({
		url: "http://api.stackexchange.com/2.2/questions/unanswered",
		data: request,
		dataType: "jsonp",
		type: "GET",
		})
	.done(function(result){
		var searchResults = showSearchResults(request.tagged, result.items.length);

		$('.search-results').html(searchResults);

		$.each(result.items, function(i, item) {
			var question = showQuestion(item);
			$('.results').append(question);
		});
	})
	.fail(function(jqXHR, error, errorThrown){
		var errorElem = showError(error);
		$('.search-results').append(errorElem);
	});
};

//takes a string of semi-colon separated tags to be searched - ajax get request
// for on StackOverflow (do they need to be semi-colon or just one tag?)
var getAnswerer = function(tags) {

	// the parameters we need to pass in our request to StackOverflow's API ////// I thought i needed the same from question, but maybe not...
	// perhaps the parameters i need are period and tags which is already in the object.
	var request = {tagged: tags,
								site: 'stackoverflow',
								order: 'desc',
								sort: 'creation'};

	var result = $.ajax({
		url: "http://api.stackexchange.com/2.2/tags/" + tags + "/top-answerers/all_time", // /2.2/tags/{tag}/top-answerers/{period}
		data: request,
		dataType: "jsonp",
		type: "GET",
		})
	//console.log(result);

	.done(function(result){
		var searchResults = showSearchResults(request.tag, result.items.length);

		$('.search-results').html(searchResults);

		$.each(result.items, function(i, item){
			var answerer = showAnswerer(item);
			$('.results'). append(answerer);
		});
	})
	.fail(function(jqXHR, error, errorThrown){
		var errorElem = showError(error);
		$('.search-results').append(errorElem);
	});
};

// this function takes the question object returned by StackOverflow 
// and creates new result to be appended to DOM
var showAnswerer = function(answerer) {

	console.log(answerer);
	//clone our result template code
	var result = $('.templates .answerer').clone(); 

	// set the user name in result
	var name = result.find('.name');
	name.text(answerer.user.display_name);

	// set the user ID
	var userId = result.find('.user-id');
	userId.text(answerer.user.user_id);

	// set the accept rate
	var acceptRate = result.find('.accept-rate');
	acceptRate.text(answerer.user.accept_rate);

	// set the link to the user
	var userLink = result.find('.user-link'); // continue to add the link and href
	userLink.html('<p>Link: <a target="_blank" href=http://stackoverflow.com/users/' + answerer.user.user_id + ' >' + answerer.user.display_name + '</a>' + '</p>');

	// set the post count
	var postCount = result.find('.post-count');
	postCount.text(answerer.post_count);

	// set the score
	var score = result.find('.score');
	score.text(answerer.score);


 	return result;
};
