0
//% color=#E7F527 icon="\uf1eb" block="Wifi Techno"
namespace WifiTechno {

    let buffer = ""
    let isWifiConnected = false;

    /**
     * Uart WiFi V2 Initialisation
     */
    //% block="Initialisation Wifi|TX %txPin|RX %rxPin|Débit %baudrate"
    //% group="UartWiFi"
    //% txPin.defl=SerialPin.P15
    //% rxPin.defl=SerialPin.P1
    //% baudRate.defl=BaudRate.BaudRate115200
    export function InitWifi(txPin: SerialPin, rxPin: SerialPin, baudRate: BaudRate) {
        
        isWifiConnected = false

        serial.redirect(
            txPin,
            rxPin,
            baudRate
        )
        sendAtCmd("AT+RESTORE")
        pause(1000)

        serial.redirect(
            txPin,
            rxPin,
            baudRate
        )

        sendAtCmd("AT+RST")
        pause(1000)
    }




    /**
     * Uart WiFi V2 connecté au Wi-Fi
     */
    //% block="Configure Wifi|TX %txPin|RX %rxPin|Débit %baudrate|SSID = %ssid|Mot de passe = %passwd"
    //% group="UartWiFi"
    //% txPin.defl=SerialPin.P15
    //% rxPin.defl=SerialPin.P1
    //% baudRate.defl=BaudRate.BaudRate115200
    export function setupWifi(txPin: SerialPin, rxPin: SerialPin, baudRate: BaudRate, ssid: string, passwd: string) {
        let result = 0

        isWifiConnected = false

        serial.redirect(
            txPin,
            rxPin,
            baudRate
        )

        sendAtCmd("AT")
        pause(100)
        sendAtCmd("ATE0")
        pause(100)
        
        grove.lcd_show_string("AT et ATE0", 0, 0)

        sendAtCmd("AT+CWMODE=1")
        result = waitAtResponse("OK", "ERROR", "None", 1000)
        grove.lcd_show_string("AT+CWMODE=1", 0, 0)
        
        sendAtCmd("AT+CWHOSTNAME=\"Micro:bit\"")
        grove.lcd_show_string("HOSTNAME        ", 0, 0)
        
               
        buffer = ""
        sendAtCmd("AT+CWJAP=\"" + ssid + "\",\"" + passwd + "\"")
        result = waitAtResponse("WIFI GOT IP", "ERROR", "None", 20000)
        grove.lcd_show_string("WIFI            ", 0, 0)
        grove.lcd_show_string(buffer, 0, 1)

        if (result == 1) {
            isWifiConnected = true
        }
    }

    /**
    * Uart WiFi V2 connecté au Wi-Fi (IP Fixe)
     */
    //% block="Configure Wifi|TX %txPin|RX %rxPin|Débit %baudrate|SSID = %ssid|Mot de passe = %passwd |Adresse IP = %adresseip |Passerelle = %gateway | Masque = %masquesr"
    //% group="UartWiFi"
    //% txPin.defl=SerialPin.P15
    //% rxPin.defl=SerialPin.P1
    //% baudRate.defl=BaudRate.BaudRate115200
    export function setupWifiandIP(txPin: SerialPin, 
                                    rxPin: SerialPin, 
                                    baudRate: BaudRate, 
                                    ssid: string, 
                                    passwd: string, 
                                    adresseip: string, 
                                    gateway: string, 
                                    masquesr: string) {
        let result = 0

        isWifiConnected = false

        serial.redirect(
            txPin,
            rxPin,
            baudRate
        )

        sendAtCmd("AT")
        pause(100)
        sendAtCmd("ATE0")
        pause(100)

        grove.lcd_show_string("AT et ATE0", 0, 0)

        sendAtCmd("AT+CWMODE=1")
        result = waitAtResponse("OK", "ERROR", "None", 1000)
        grove.lcd_show_string("AT+CWMODE=1", 0, 0)
        sendAtCmd("AT+CWHOSTNAME=\"Micro:bit\"")
        grove.lcd_show_string("HOSTNAME        ", 0, 0)

        sendAtCmd("AT+CWDHCP=0,3")
        pause(100)
        grove.lcd_show_string("STOP DHCP        ", 0, 0)

        sendAtCmd("AT+CIPSTA=\"" + adresseip + "\",\"" + gateway + "\",\"" + masquesr + "\"")
        result = waitAtResponse("OK", "ERROR", "None", 1000)
        grove.lcd_show_string("FIXE IP           ", 0, 0)

        //grove.lcd_clear()
        //grove.lcd_show_string("ip", 0, 0)
        //grove.lcd_show_string(buffer, 0, 1)
        //pause(10000)

        basic.showString("w")
        sendAtCmd("AT+CWJAP=\"" + ssid + "\",\"" + passwd + "\"")
        buffer=""
        result = waitAtResponse("OK", "ERROR", "None", 20000)
        grove.lcd_show_string("WIFI            ", 0, 0)
        grove.lcd_show_string(buffer, 0, 1)

        if (result == 1) {
            isWifiConnected = true
        }
        
    }



    /**
     * Check if Grove - Uart WiFi V2 is connected to Wifi
     */
    //% block="Wifi OK?"
    //% group="UartWiFi"
    export function wifiOK() {
        return isWifiConnected
    }

    /**
     * Send data to ThinkSpeak
     */
    //% block="Envoie vos données vers votre canal ThinkSpeak|Clé API d'écriture %apiKey|Champ1 %field1|Champ2 %field2|Champ3 %field3|Champ4 %field4|Champ5 %field5|Champ6 %field6|Champ7 %field7|Champ8 %field8"
    //% group="UartWiFi"
    //% apiKey.defl="votre Clé API d'écriture"
    export function sendToThinkSpeak(apiKey: string, field1: number, field2: number, field3: number, field4: number, field5: number, field6: number, field7: number, field8: number) {
        let result = 0
        let retry = 2

        // close the previous TCP connection
        if (isWifiConnected) {
            sendAtCmd("AT+CIPCLOSE")
            waitAtResponse("OK", "ERROR", "None", 2000)
        }

        while (isWifiConnected && retry > 0) {
            retry = retry - 1;
            // establish TCP connection
            sendAtCmd("AT+CIPSTART=\"TCP\",\"api.thingspeak.com\",80")
            result = waitAtResponse("OK", "ALREADY CONNECTED", "ERROR", 2000)
            if (result == 3) continue

            let data = "GET /update?api_key=" + apiKey
            if (!isNaN(field1)) data = data + "&field1=" + field1
            if (!isNaN(field2)) data = data + "&field2=" + field2
            if (!isNaN(field3)) data = data + "&field3=" + field3
            if (!isNaN(field4)) data = data + "&field4=" + field4
            if (!isNaN(field5)) data = data + "&field5=" + field5
            if (!isNaN(field6)) data = data + "&field6=" + field6
            if (!isNaN(field7)) data = data + "&field7=" + field7
            if (!isNaN(field8)) data = data + "&field8=" + field8

            sendAtCmd("AT+CIPSEND=" + (data.length + 2))
            result = waitAtResponse(">", "OK", "ERROR", 2000)
            if (result == 3) continue
            sendAtCmd(data)
            result = waitAtResponse("SEND OK", "SEND FAIL", "ERROR", 5000)

            // // close the TCP connection
            // sendAtCmd("AT+CIPCLOSE")
            // waitAtResponse("OK", "ERROR", "None", 2000)

            if (result == 1) break
        }
    }

    /**
     * Send data to IFTTT
     */
    //% block="Send Data to your IFTTT Event|Event %event|Key %key|value1 %value1|value2 %value2|value3 %value3"
    //% group="UartWiFi"
    //% event.defl="your Event"
    //% key.defl="your Key"
    //% value1.defl="hello"
    //% value2.defl="micro"
    //% value3.defl="bit"
    function sendToIFTTT(event: string, key: string, value1: string, value2: string, value3: string) {
        let result = 0
        let retry = 2

        // close the previous TCP connection
        if (isWifiConnected) {
            sendAtCmd("AT+CIPCLOSE")
            waitAtResponse("OK", "ERROR", "None", 2000)
        }

        while (isWifiConnected && retry > 0) {
            retry = retry - 1;
            // establish TCP connection
            sendAtCmd("AT+CIPSTART=\"TCP\",\"maker.ifttt.com\",80")
            result = waitAtResponse("OK", "ALREADY CONNECTED", "ERROR", 2000)
            if (result == 3) continue

            let data = "GET /trigger/" + event + "/with/key/" + key
            data = data + "?value1=" + value1
            data = data + "&value2=" + value2
            data = data + "&value3=" + value3
            data = data + " HTTP/1.1"
            data = data + "\u000D\u000A"
            data = data + "User-Agent: curl/7.58.0"
            data = data + "\u000D\u000A"
            data = data + "Host: maker.ifttt.com"
            data = data + "\u000D\u000A"
            data = data + "Accept: */*"
            data = data + "\u000D\u000A"

            sendAtCmd("AT+CIPSEND=" + (data.length + 2))
            result = waitAtResponse(">", "OK", "ERROR", 2000)
            if (result == 3) continue
            sendAtCmd(data)
            result = waitAtResponse("SEND OK", "SEND FAIL", "ERROR", 5000)

            // // close the TCP connection
            // sendAtCmd("AT+CIPCLOSE")
            // waitAtResponse("OK", "ERROR", "None", 2000)

            if (result == 1) break
        }
    }


    function waitAtResponse(target1: string, target2: string, target3: string, timeout: number) {
        
        let start = input.runningTime()
        buffer=""
        while ((input.runningTime() - start) < timeout) {
            buffer += serial.readString()

            if (buffer.includes(target1)) return 1
            if (buffer.includes(target2)) return 2
            if (buffer.includes(target3)) return 3

            basic.pause(100)
        }

        return 0
    }


    /**
    * Envoyer une commande AT
    */
    //% block="Envoyer Commande |Command AT = %cmd"
    //% SC="SC"


    function sendAtCmd(cmd: string) {
        serial.writeString(cmd + "\u000D\u000A")
    }
}