(function() {
    angular.module('pc.growth', []);

    PostCodeGrowth.$inject = ['$http', '$q', 'growthOptions'];

    function PostCodeGrowth($http, $q, options) {
        var sortList = ['Pop', 'PGrowth', 'HGrowth', 'UGrowth', ''];
        return {
            query: _query,
            bestPerforming: _bestPerforming
        }

        function _bestPerforming(year, orderBy, orderByDirection, state) {
            if (state) {
                filter += 'and State eq \'' + state + '\'';
            }

            if (!orderByDirection) {
                orderByDirection = 'desc';
            }

            var filter = 'YearEnding eq ' + year,
                params = {
                    $filter: filter,
                    $orderby: orderBy + ' ' + orderByDirection
                }

            return _query(params);
        }

        function _query(params) {
            var deferred = $q.defer(),
                url = options.baseUrl;

            $http.get(url, {
                params: params
            }).success(function(data) {
                deferred.resolve(data);
            }).error(function(data) {
                deferred.reject(data)
            })

            return deferred.promise;
        }
    }

    angular
        .module('pc.growth')
        .service('PostCodeGrowth', PostCodeGrowth)
        .value('growthOptions', {
            baseUrl: 'https://development.propertycompass.com.au:22001/growth/postcode'
        })
})();
