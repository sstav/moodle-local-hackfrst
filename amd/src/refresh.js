// This file is part of Moodle - http://moodle.org/
//
// Moodle is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// Moodle is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with Moodle.  If not, see <http://www.gnu.org/licenses/>.

/**
 * This is an empty module, that is required before all other modules.
 * Because every module is returned from a request for any other module, this
 * forces the loading of all modules with a single request.
 *
 * @module     local_hackfrst/refresh
 * @package    local_hackfrst
 * @copyright  2015 Damyon Wiese <damyon@moodle.com>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 * @since      2.9
 */
/* eslint-disable no-trailing-spaces */
/* eslint-disable no-console */
/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */

define(['jquery', 'core/ajax', 'core/config','core/templates', 'core/notification'],
    function($, ajax, config, templates, notification) {
    return /** @alias module:local_hackfrst/refresh */ {
        
        /**
         * Refresh the middle of the page!
         *
         * @method refresh
         */
        refresh: () => {
            // Add a click handler to the button.
            function init(){
                $('#refresh').on('click', () => {
                    let str = document.getElementById('elem').value;
                    // First - reload the data for the page.
                    ajax.call([{
                        methodname: 'local_integrator_teta',
                        args: { "PARAM1": str },
                        done: (r) => {notification.alert('שלום', r.toString(), 'המשך');},
                        fail: notification.exception
                    }]);
                });
            }

            $( () => { init(); });
        }
    };
});
