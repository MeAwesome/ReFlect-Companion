# Module: Clock

**Developed By:** *[Isaac Robbins](https://github.com/MeAwesome)*

**Last Update:** *11/13/2019*

## Purpose

Display the current time and date on the mirror.

## Images



## Installation

This module comes pre-installed with ReFlect.

## Configuration

Configure this module in the `data.json` file or using the default *controller* module.

| Option        | Description
| ------------- | -----------
| `region`      | The region on the mirror to be displayed. <br><br> **Possible Values:** *Read [Regions](https://github.com/MeAwesome/ReFlect/wiki/Regions#valid-regions)* <br> **Default Value:** `top-left`
| `type`       | Changes the type of clock. <br><br> **Possible Values:** `digital` or `analog` <br> **Default Value:** `digital`
| `theme`       | Changes how the clock will be rendered. <br><br> **Possible Values:** *Read [Clock > Themes](https://github.com/MeAwesome/ReFlect/tree/master/modules/default/clock/themes)* <br> **Default Value:** `default`
| `timeFormat`  | Displays the time in a `12` or `24` hour format. <br> ***Requires*** `style` ***to be set to*** `digital`***.*** <br><br> **Possible Values:** `12` or `24` <br> **Default Value:** `12`
| `seconds`     | Displays the seconds. <br><br> **Possible Values:** `true` or `false` <br> **Default Value:** `false`
| `periodStyle` | Changes how the period will be shown. <br> ***Requires*** `timeFormat` ***to be set to*** `12`***.*** <br><br> **Possible Values:** `lowercase`, `uppercase`, or `hidden` <br> **Default Value:** `lowercase`
| `date`        | Displays the date. <br><br> **Possible Values:** `true` or `false` <br> **Default Value:** `true`
| `dateFormat`  | Changes how the date will be displayed. <br> ***Requires*** `date` ***to be set to*** `true`***.*** <br><br> **Possible Values:** *Read [Dates](https://github.com/MeAwesome/ReFlect/wiki/Dates)* <br> **Default Value:** `dddd-mmmm-d-yyyy`
| `timezone`    | Changes the timezone of the clock. <br><br> **Possible Values:** `eastern`, `central`, `mountain`, `pacific`, or `auto` <br> **Default Value:** `auto`

##
