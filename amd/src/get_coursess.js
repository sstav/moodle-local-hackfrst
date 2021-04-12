/**
 * Frameworks datasource.
 *
 * This module is compatible with core/form-autocomplete.
 *
 * @package    local_technionsearch
 * @copyright  2019 Stossel Yarden - Technion
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

// eslint-disable-next-line no-undef
define(['jquery', 'core/ajax'],
  /**
     *
     * @param Ajax
     * @returns {{
     *              suggestionDesign: (function(*): string),
     *              transport: module:local_technionsearch/get_courses_names.transport,
     *              processResults: (function(*, *=): [])
     *           }}
     */
  function ($, Ajax) {
    return /** @alias module:local_technionsearch/get_courses_names */ {
      /**
         *
         * @param {{course_name: string, course_id: int, faculty: {name: string}, semesters: [{name: string}]}}course
         * @returns {string}
         */
      suggestionDesign: function (course) {
        var label = course.course_name + ' (' + course.course_id + ')'
        // eslint-disable-next-line camelcase
        var semester_text = ''
        if (
          typeof course.semesters !== 'undefined' &&
                typeof course.semesters[0] !== 'undefined' &&
                typeof course.semesters[0].name !== 'undefined') {
          // eslint-disable-next-line camelcase
          semester_text = ' - ' + course.semesters[0].name
        }
        // eslint-disable-next-line camelcase
        label = '<span>' + label + '</span><br><small>' + course.faculty.name + semester_text + '</small>'
        return label
      },
      processResults: function (selector, results) {
        var self = this
        var items = []
        $.each(results, function (index, item) {
          items.push({
            value: item.course_id,
            label: self.suggestionDesign(item)
          })
        })
        return items
      },
      transport: function (selector, query, success, failure) {
        var promise

        promise = Ajax.call([{
          methodname: 'local_technionsearch_course',
          args: {
            query: query
          }
        }])

        promise[0].then(function (data) {
          var results = data.result
          /**
                 * @type {Array}
                 * @var {{courses}} results
                 */
          var promises = []; var i = 0

          // Apply the label to the results.
          return $.when.apply($.when, promises).then(function () {
            var args = arguments
            $.each(results, function (index, course) {
              course._label = args[i]
              i++
            })
            success(results)
            return null
          })
        }).catch(failure)
      }
    }
  })
