(function() {
    'use strict';

    // https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API/Using_the_Web_Storage_API
    var storageAvailable = function(type) {
        try {
            var storage = window[type],
                x = '__storage_test__';
            storage.setItem(x, x);
            storage.removeItem(x);
            return true;
        }
        catch(e) {
            return false;
        }
    }

    var replaceImage = function(url) {
        var container = document.getElementById('butt-container');
        var img = document.createElement('img');
        img.src = url;
        img.alt = '';
        container.innerHTML = '';
        container.appendChild(img);
    };

    var replaceYoutube = function(url) {
        var container = document.getElementById('butt-container');
        container.innerHTML = '<iframe id="ytplayer" type="text/html" '
        + 'width="640" height="390" src="' + url + '" frameborder="0"/>'
        ;
    };

    var xhr = new XMLHttpRequest();
    xhr.onload = function(e) {
        if (xhr.status >= 200 && xhr.status < 400) {
            var chosenJacksonIdx;
            var chosenJackson;
            var jacksons = JSON.parse(this.responseText);
            if (storageAvailable('sessionStorage')) {
                // If we've already loaded an image before in
                // this session, cycle through to the next
                if (sessionStorage.getItem('currentIdx') !== null) {
                    chosenJacksonIdx = (sessionStorage.getItem('currentIdx') + 1) % (jacksons.length);
                } else {
                    // Otherwise, start with a random one
                    chosenJacksonIdx = Math.floor(jacksons.length * Math.random());
                }
                sessionStorage.setItem('currentIdx', chosenJacksonIdx);
                chosenJackson = jacksons[chosenJacksonIdx];
            }
            if (chosenJackson.type === 'image') {
                replaceImage(chosenJackson.url);
            } else if (chosenJackson.type === 'video') {
                replaceYoutube(chosenJackson.url);
            }
        } else {
            console.error('Could not retrieve.');
        }
    };

    xhr.onerror = function() {
        console.error('An error occurred retrieving.')
    };
    xhr.open('GET', '/resources.json');
    xhr.send();

})();