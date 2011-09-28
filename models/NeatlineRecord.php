<?php
/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4; */

/**
 * Row class for Neatline record.
 *
 * PHP version 5
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
?>

<?php

class NeatlineRecord extends Omeka_record
{

    public $neatline_id;
    public $item_id;
    public $element_id;
    public $element_text_id;

    /**
     * Fetch the associated element text.
     *
     * @return Omeka_record The text.
     */
    public function getElementText()
    {

        $elementTextTable = $this->getTable('ElementText');
        return $elementTextTable->find($this->element_text_id);

    }

    /**
     * Create the child element text.
     *
     * @param string $text The content text.
     *
     * @return Omeka_record $elementText The new text.
     */
    public function createElementText($text)
    {

        // Get the Item record type object.
        $recordTypeTable = $this->getTable('RecordType');
        $itemRecordType = $recordTypeTable->findBySql('name = ?', array('Item'), true);

        // Populate.
        $elementText = new ElementText;
        $elementText->record_id = $this->item_id;
        $elementText->record_type_id = $itemRecordType->id;
        $elementText->element_id = $this->element_id;
        $elementText->text = $text;
        $elementText->save();

        return $elementText;

    }

    /**
     * Update the value of the associated element text.
     *
     * @param string $text The content text.
     *
     * @return Omeka_record $elementText The updated text.
     */
    public function updateElementText($text)
    {

        $elementText = $this->getElementText();
        $elementText->text = $text;
        $elementText->save();

        return $elementText;

    }

}
