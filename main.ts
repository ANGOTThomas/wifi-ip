input.onButtonPressed(Button.A, function () {
    basic.showIcon(IconNames.SmallHeart)
    WifiTechno.InitWifi(SerialPin.P15, SerialPin.P1, BaudRate.BaudRate115200)
    grove.lcd_init()
    grove.lcd_clear()
    grove.lcd_show_string("Hello DHCP", 0, 0)
    basic.showIcon(IconNames.Heart)
    WifiTechno.setupWifi(
    SerialPin.P15,
    SerialPin.P1,
    BaudRate.BaudRate115200,
    "Freebox-4B0DF8",
    "quaterni4&-repulsos9-prorut%@-archidamum?"
    )
    if (WifiTechno.wifiOK()) {
        basic.showIcon(IconNames.Happy)
    } else {
        basic.showIcon(IconNames.Sad)
    }
})
input.onButtonPressed(Button.B, function () {
    basic.showIcon(IconNames.SmallHeart)
    WifiTechno.InitWifi(SerialPin.P15, SerialPin.P1, BaudRate.BaudRate115200)
    grove.lcd_init()
    grove.lcd_clear()
    grove.lcd_show_string("Hello IP FIXE", 0, 0)
    basic.showIcon(IconNames.Heart)
    WifiTechno.setupWifiandIP(
    SerialPin.P15,
    SerialPin.P1,
    BaudRate.BaudRate115200,
    "Freebox-4B0DF8",
    "quaterni4&-repulsos9-prorut%@-archidamum?",
    "192.168.1.1",
    "192.168.1.254",
    "255.255.255.0"
    )
    if (WifiTechno.wifiOK()) {
        basic.showIcon(IconNames.Happy)
    } else {
        basic.showIcon(IconNames.Sad)
    }
})
grove.lcd_init()
grove.lcd_clear()
grove.lcd_dispaly_on()
basic.forever(function () {
	
})
