(function(){
    // var require = blanket.options("commonJS") ? blanket._commonjs.require : window.require;
    var N = blanket.options("commonJS") ? blanket._commonjs.requirejs : window.NR;
    // if (!_blanket.options("engineOnly") && _blanket.options("existingRequireJS")){

    _blanket.utils.oldloader = N.loadJS;

    N.loadJS = function (url) {
        _blanket.requiringFile(url);
        _blanket.utils.getFile(url, 
            function(content){ 
                _blanket.utils.processFile(
                    content,
                    url,
                    function newLoader(){
                    },
                    function oldLoader(){
                        _blanket.utils.oldloader(url);
                    }
                );
            }, function (err) {
                _blanket.requiringFile();
                throw err;
            });
    };


    // }
})();