grove.lcd_init()
grove.lcd_dispaly_on()
grove.lcd_show_string("Hello", 0, 0)
basic.showIcon(IconNames.Heart)
WifiTechno.setupWifi(
SerialPin.P15,
SerialPin.P1,
BaudRate.BaudRate115200,
"s7toto",
"lehavre123"
)
if (WifiTechno.wifiOK()) {
    basic.showIcon(IconNames.Happy)
} else {
    basic.showIcon(IconNames.Sad)
}
basic.forever(function () {
	
})
