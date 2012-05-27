/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4; */

/**
 * Detail bubbles.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not
 * use this file except in compliance with the License. You may obtain a copy of
 * the License at http://www.apache.org/licenses/LICENSE-2.0 Unless required by
 * applicable law or agreed to in writing, software distributed under the
 * License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS
 * OF ANY KIND, either express or implied. See the License for the specific
 * language governing permissions and limitations under the License.
 *
 * @package     omeka
 * @subpackage  neatline
 * @author      Scholars' Lab <>
 * @author      Bethany Nowviskie <bethany@virginia.edu>
 * @author      Adam Soroka <ajs6f@virginia.edu>
 * @author      David McClure <david.mcclure@virginia.edu>
 * @copyright   2011 The Board and Visitors of the University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html Apache 2 License
 */

(function($, undefined) {

    'use strict';

    $.widget('neatline.bubbles', {

        /*
         * Construct template.
         *
         * @return void.
         */
        _create: function() {

            // Getters.
            this._body = $('body');
            this._window = $(window);

            // Build template.
            this.template = _.template(
                $('#bubble-template').html()
            );

            // Trackers.
            this.bubble = null;
            this.frozen = false;
            this.connector = false;

        },

        /*
         * Show bubble.
         *
         * @param {String} title: The title.
         * @param {String} body: The body.
         *
         * @return void.
         */
        show: function(title, body) {

            // If bubble is frozen, break.
            if (this.frozen) return;

            // If bubble exists, remove.
            if (!_.isNull(this.bubble)) {
                this.bubble.remove();
            }

            // Render template.
            this.bubble = $(this.template({
                title: title,
                body: body
            }));

            // Get native dimensions of bubble.
            this._measureBubble();

            // Get components.
            this.freezeLink = this.bubble.find('a.freeze-bubble');
            this.closeLink = this.bubble.find('a.close-bubble');

            // Inject.
            this.element.append(this.bubble);

            // Listen for mousemove.
            this._window.bind({
                'mousemove.bubbles': _.bind(function(e) {
                    this.position(e);
                }, this)
            });

        },

        /*
         * Hide bubble.
         *
         * @return void.
         */
        hide: function() {

            // If bubble is frozen, break.
            if (this.frozen) return;

            // Remove bubble.
            this.bubble.remove();
            this.connector.remove();
            this.bubble = null;

            // Strip move listener.
            this._window.unbind('mousemove.bubbles');

        },

        /*
         * Freeze bubble.
         *
         * @return void.
         */
        freeze: function() {

            // Set tracker.
            this.frozen = true;

            // Strip mousemove listener.
            this._window.unbind('mousemove.bubbles');

            // Toggle link.
            this.freezeLink.css('display', 'none');
            this.closeLink.css('display', 'block');

            // Increase opacity.
            this.bubble.animate({ 'opacity': 0.8 }, 60);
            this.triangle.animate({ 'opacity': 0.8 }, 60);

            // Listen for close.
            this.closeLink.mousedown(_.bind(function() {
                this.frozen = false;
                this.hide();
            }, this));

        },

        /*
         * Position bubble.
         *
         * @param {Object} event: The mousemove event.
         *
         * @return void.
         */
        position: function(event) {

            // Get container size.
            var containerWidth = this.element.outerWidth();
            var containerHeight = this.element.outerHeight();

            // Get container offset.
            var offset = this.element.offset();
            var containerX = event.clientX - offset.left;
            var containerY = event.clientY - offset.top;

            // Build starting bubble offsets.
            var bubbleY = containerY - (this.bubbleHeight/3);
            var bubbleX = containerX + 100;

            // If necessary, switch to left side.
            if (bubbleX + this.bubbleWidth > containerWidth) {
                bubbleX = containerX - this.bubbleWidth - 100;
            }

            // Block top cropping.
            if (bubbleY < 0) {
                bubbleY = 0;
            }

            // Block bottom cropping.
            if (bubbleY + this.bubbleHeight > containerHeight) {
                bubbleY = containerHeight-this.bubbleHeight;
            }

            // Catch full-height.
            if (this.bubbleHeight > containerHeight) {
                bubbleY = 0;
                this.bubble.css('overflow-y', 'scroll');
                this.bubble.outerHeight(containerHeight);
            }

            // Render position.
            this.bubble.css({
                left: bubbleX,
                top: bubbleY
            });

            // Remove existing connector.
            if (this.connector) this.connector.remove();

            // If the bubble is on the right.
            if (bubbleX > containerX) {

                // Build connector.
                var offsetX = event.clientX+20;
                var offsetY = offset.top+bubbleY;
                var width = bubbleX-containerX-20;
                this.connector = Raphael(
                    offsetX, offsetY, width, this.bubbleHeight
                );

                // Render connector.
                var cursorOffset = containerY - bubbleY;
                this.triangle = this.connector.path(
                    'M1,' + cursorOffset + 'L99,30 400,170Z'
                );

            }

            // If the bubble is on the left.
            else {

                // Build connector.
                var offsetX = bubbleX+this.bubbleWidth+offset.left;
                var offsetY = offset.top+bubbleY;
                var width = containerX-(bubbleX+this.bubbleWidth)-20;
                this.connector = Raphael(
                    offsetX, offsetY, width, this.bubbleHeight
                );

                // Render connector.
                var cursorOffset = containerY - bubbleY;
                this.triangle = this.connector.path(
                    'M'+width+',' + cursorOffset + 'L1,30 -400,170Z'
                );

            }

            // Set conncetor styles.
            this.triangle.attr({
                fill: '#000',
                opacity: 0.7
            });

        },

        /*
         * Compute the native dimensions of the bubble.
         *
         * @return void.
         */
        _measureBubble: function() {

            // Clone and append the bubble.
            var clone = this.bubble.clone().css({
                top: -1000,
                left: -1000
            }).appendTo(this._body);

            // Get dimensions.
            this.bubbleHeight = clone.outerHeight();
            this.bubbleWidth = clone.outerWidth();

            // Remove clone.
            clone.remove();

        }

    });


})(jQuery);