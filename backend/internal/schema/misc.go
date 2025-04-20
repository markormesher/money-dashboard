package schema

import "time"

var PlatformMinimumDate, _ = time.Parse(time.DateOnly, "2015-04-06")
var PlatformMaximumDate, _ = time.Parse(time.DateOnly, "2099-12-31")
