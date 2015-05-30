/**
 * propertycompass.growth.angular - Angular service for the Property Compass growth API
 * @version v0.0.1
 * @link https://github.com/galenp/PC.Component.Growth
 * @license MIT
 */
(function() {
    angular.module('pc.growth', []);

    PostCodeGrowth.$inject = ['$http', '$q', 'growthOptions'];

    function PostCodeGrowth($http, $q, options) {
        return {
            query: _query,
            bestPerforming: _bestPerforming,
            bestOverTime: _bestOverTime,
            details: _details,
            detailsOverTime: _detailsOverTime
        };

        function _details(postCode) {
            var filter = 'PostCode eq ' + postCode,
                url = options.baseUrl,
                orderBy = 'YearEnding asc',
                params = {
                    $filter: filter,
                    $orderby: orderBy
                };

            return _query(url, params);
        }

        function _detailsOverTime(postCode) {
            var filter = 'PostCode eq ' + postCode,
                url = options.baseUrl + '/average',
                params = {
                    $filter: filter,
                    $orderby: 'PostCode asc'
                };

            return _query(url, params);
        }

        function _bestOverTime(orderBy, orderByDirection, state) {
            var sortList = ['avPGrowth', 'avHGrowth', 'avUGrowth', ''],
                url = options.baseUrl + '/average',
                filter = undefined;

            if (sortList.indexOf(orderBy) === -1) {
                throw new Error('Invalid orderBy specified, only "avPGrowth", "avHGrowth" and "avUGrowth" allowed.');
            }

            if (!orderByDirection) {
                orderByDirection = 'desc';
            }

            if (state) {
                filter = 'State eq \'' + state + '\'';
            }

            var params = {
                    $filter: filter,
                    $orderby: orderBy + ' ' + orderByDirection
                };

            return _query(url, params);
        }

        function _bestPerforming(year, orderBy, orderByDirection, state) {
            var sortList = ['Pop', 'PGrowth', 'HGrowth', 'UGrowth', ''],
                url = options.baseUrl;

            if (sortList.indexOf(orderBy) === -1) {
                throw new Error('Invalid orderBy specified, only "Pop", "PGrowth", "HGrowth" and "UGrowth" allowed.');
            }

            if (!orderByDirection) {
                orderByDirection = 'desc';
            }

            var filter = 'YearEnding eq ' + year,
                params = {
                    $filter: filter,
                    $orderby: orderBy + ' ' + orderByDirection
                };

            if (state) {
                params.$filter += ' and State eq \'' + state + '\'';
            }

            return _query(url, params);
        }

        function _query(url, params) {
            var deferred = $q.defer();

            $http.get(url, {
                params: params
            }).success(function(data) {
                deferred.resolve(data);
            }).error(function(data) {
                deferred.reject(data)
            });

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
