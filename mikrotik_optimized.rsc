# OPTIMIZED SCRIPT - 2026-01-19
# Based on Analysis by AI
#
# Changes:
# 1. PCC Classifier changed to "both-addresses" for better compatibility (Banking/SSL).
# 2. Added Input/Output Mangle rules for correct Router traffic (Ping/DNS/VPN) handling.
# 3. Upgraded Queue Type from PCQ to CAKE (Smart Queue Management).
# 4. Optimized Failover Scripts (Removed aggressive connection clearing on UP).
#
/interface bridge
add comment="Bridge untuk LAN Port 3-5" name=bridge-lan
/interface ethernet
set [ find default-name=ether1 ] comment=ISP1_300Mbps mac-address=18:FD:74:A4:46:1A
set [ find default-name=ether2 ] comment=ISP2_250Mbps mac-address=18:FD:74:A4:46:1B
set [ find default-name=ether3 ] comment=LAN3 mac-address=18:FD:74:A4:46:1C
set [ find default-name=ether4 ] comment=LAN4 mac-address=18:FD:74:A4:46:1D
set [ find default-name=ether5 ] comment=LAN5 mac-address=18:FD:74:A4:46:1E
/interface list
add name=LAN
add name=WAN
/interface wireless security-profiles
set [ find default=yes ] supplicant-identity=MikroTik
/ip pool
add name=dhcp_pool ranges=10.10.10.21-10.10.10.254
/ip dhcp-server
add address-pool=dhcp_pool interface=bridge-lan name=dhcp1
/queue type
# CHANGED: Using CAKE for better bufferbloat mitigation
add kind=cake name=cake-download cake-flowmode=triple-isolate cake-rtt-scheme=internet
add kind=cake name=cake-upload cake-flowmode=triple-isolate cake-rtt-scheme=internet
/queue simple
# CHANGED: Updated to use CAKE types
add comment="CAKE Smart Queue - Dynamic Limit" max-limit=550M/550M name=01_Total_Office_CAKE queue=cake-upload/cake-download target=10.10.10.0/24
/routing table
add disabled=no fib name=to_ISP1
add disabled=no fib name=to_ISP2
/system logging action
add memory-lines=500 name=failover target=memory
add disk-file-name=firewall name=firewall target=disk
/interface bridge port
add bridge=bridge-lan interface=ether3
add bridge=bridge-lan interface=ether4
add bridge=bridge-lan interface=ether5
/ip firewall connection tracking
set enabled=yes tcp-established-timeout=30m
/ip settings
set rp-filter=loose
/interface list member
add interface=bridge-lan list=LAN
add interface=ether1 list=WAN
add interface=ether2 list=WAN
/ip address
add address=10.10.10.1/24 comment=LAN interface=bridge-lan network=10.10.10.0
add address=192.168.1.10/24 comment="Static IP ISP1" interface=ether1 network=192.168.1.0
add address=192.168.166.2/24 comment="Static IP ISP2" interface=ether2 network=192.168.166.0
/ip dhcp-server lease
add address=10.10.10.20 comment="Server aaPanel Ubuntu" mac-address=E0:07:1B:FF:78:33
add address=10.10.10.3 comment="RUIJIE - Laundry" mac-address=C8:CD:55:01:72:3C
add address=10.10.10.4 comment="RUIJIE - Perpustakaan" mac-address=10:5F:02:8D:D8:15
add address=10.10.10.9 comment="RUIJIE - Ruang Guru" mac-address=9C:CE:88:A4:17:11
add address=10.10.10.10 comment="RUIJIE - Rumah Rio" mac-address=C4:B2:5B:9A:79:31
add address=10.10.10.13 comment="RUIJIE - RT" mac-address=9C:CE:88:A4:16:99
add address=10.10.10.14 comment="RUIJIE - Saung Belajar" mac-address=F0:74:8D:B5:61:74
add address=10.10.10.2 comment="RUIJIE - Master Lab Jar" mac-address=98:4A:6B:45:E2:35
add address=10.10.10.5 comment="RUIJIE - Ruang Arsip" mac-address=58:B4:BB:48:6F:28
add address=10.10.10.6 comment="RUIJIE - Home Ardio" mac-address=58:B4:BB:48:A7:7C
add address=10.10.10.7 comment="RUIJIE - Ruang TU" mac-address=58:B4:BB:48:B4:F1
add address=10.10.10.8 comment="RUIJIE - Ruang Material" mac-address=58:B4:BB:48:C9:F5
add address=10.10.10.11 comment="RUIJIE - Lab Multi" mac-address=58:B4:BB:49:00:96
add address=10.10.10.12 comment="RUIJIE - Ruang Rapat" mac-address=58:B4:BB:49:1A:D6
/ip dhcp-server network
add address=10.10.10.0/24 dns-server=10.10.10.1 gateway=10.10.10.1 netmask=24
/ip dns
set allow-remote-requests=yes cache-size=4096KiB max-concurrent-queries=200 max-udp-packet-size=512 servers=1.1.1.3,1.0.0.3 use-doh-server=https://family.cloudflare-dns.com/dns-query verify-doh-cert=yes
/ip firewall address-list
add address=10.10.10.0/24 comment="Network LAN" list=LOKAL
add address=192.168.1.0/24 comment="Modem ISP1" list=LOKAL
add address=192.168.166.0/24 comment="Modem ISP2" list=LOKAL
add address=klikbca.com comment=BANKING list=WEBSITE_SENSITIF
add address=ibank.klikbca.com list=WEBSITE_SENSITIF
add address=bankmandiri.co.id list=WEBSITE_SENSITIF
add address=ib.bri.co.id list=WEBSITE_SENSITIF
add address=djponline.pajak.go.id list=WEBSITE_SENSITIF
add address=sso.bpjs-kesehatan.go.id list=WEBSITE_SENSITIF
add address=whatsapp.net comment=WA_Call_Stabil list=WEBSITE_SENSITIF
add address=whatsapp.com list=WEBSITE_SENSITIF
add address=sakti.kemenkeu.go.id comment=WEB_TAMBAHAN list=WEBSITE_SENSITIF
add address=siman.kemenkeu.go.id comment=WEB_TAMBAHAN list=WEBSITE_SENSITIF
add address=sso.kemenkeu.go.id comment=WEB_TAMBAHAN list=WEBSITE_SENSITIF
add address=sso.data.kemendikdasmen.go.id comment=WEB_TAMBAHAN list=WEBSITE_SENSITIF
add address=vervalptk.data.kemdikbud.go.id comment=WEB_TAMBAHAN list=WEBSITE_SENSITIF
add address=vervalpd.data.kemdikbud.go.id comment=WEB_TAMBAHAN list=WEBSITE_SENSITIF
add address=zoom.us comment=WEB_TAMBAHAN list=WEBSITE_SENSITIF
add address=zoom.com comment=WEB_TAMBAHAN list=WEBSITE_SENSITIF
/ip firewall filter
add action=drop chain=input comment="1. Drop Invalid Input" connection-state=invalid
add action=accept chain=input comment="2. Accept Established/Related Input" connection-state=established,related
add action=accept chain=input comment="4. Allow ICMP (Ping)" protocol=icmp
add action=accept chain=input comment="5. Allow Admin Access from LAN" in-interface-list=LAN src-address=10.10.10.0/24
add action=drop chain=input comment="6. Drop All Other Input"
add action=drop chain=forward comment="7. Drop Invalid Forward" connection-state=invalid
add action=accept chain=forward comment="8. Accept Established/Related Forward" connection-state=established,related
add action=accept chain=forward comment="9. Allow Port Forwarding (DSTNAT)" connection-nat-state=dstnat
add action=accept chain=forward comment="10. Allow LAN to WAN" in-interface-list=LAN out-interface-list=WAN
add action=drop chain=forward comment="11. Drop All Other Forward"
/ip firewall mangle
# ADDED: Input/Output Marking for Router Traffic
add action=mark-connection chain=input comment="IN_ISP1" in-interface=ether1 new-connection-mark=ISP1_conn passthrough=yes
add action=mark-connection chain=input comment="IN_ISP2" in-interface=ether2 new-connection-mark=ISP2_conn passthrough=yes
add action=mark-routing chain=output comment="OUT_ISP1" connection-mark=ISP1_conn new-routing-mark=to_ISP1 passthrough=no
add action=mark-routing chain=output comment="OUT_ISP2" connection-mark=ISP2_conn new-routing-mark=to_ISP2 passthrough=no

add action=accept chain=prerouting comment=0_Bypass_Traffic_Lokal dst-address-list=LOKAL src-address-list=LOKAL
add action=add-dst-to-address-list address-list=WEBSITE_SENSITIF address-list-timeout=1d chain=prerouting comment=1_Auto_Detect_TLS_Optimized connection-state=new dst-address-list=!LOKAL dst-port=443 in-interface=bridge-lan protocol=tcp tls-host=".*\\.(go|co|ac|sch)\\.id\$"
add action=mark-connection chain=prerouting comment=2_Sticky_Sensitif_ISP1_Main dst-address-list=WEBSITE_SENSITIF in-interface=bridge-lan new-connection-mark=ISP1_conn

# CHANGED: PCC Classifier to "both-addresses" for stability
add action=mark-connection chain=prerouting comment=3_PCC_ISP1_300Mbps_slot0 connection-mark=no-mark connection-state=new in-interface=bridge-lan new-connection-mark=ISP1_conn per-connection-classifier=both-addresses:11/0
add action=mark-connection chain=prerouting comment=3_PCC_ISP1_300Mbps_slot1 connection-mark=no-mark connection-state=new in-interface=bridge-lan new-connection-mark=ISP1_conn per-connection-classifier=both-addresses:11/1
add action=mark-connection chain=prerouting comment=3_PCC_ISP1_300Mbps_slot2 connection-mark=no-mark connection-state=new in-interface=bridge-lan new-connection-mark=ISP1_conn per-connection-classifier=both-addresses:11/2
add action=mark-connection chain=prerouting comment=3_PCC_ISP1_300Mbps_slot3 connection-mark=no-mark connection-state=new in-interface=bridge-lan new-connection-mark=ISP1_conn per-connection-classifier=both-addresses:11/3
add action=mark-connection chain=prerouting comment=3_PCC_ISP1_300Mbps_slot4 connection-mark=no-mark connection-state=new in-interface=bridge-lan new-connection-mark=ISP1_conn per-connection-classifier=both-addresses:11/4
add action=mark-connection chain=prerouting comment=3_PCC_ISP1_300Mbps_slot5 connection-mark=no-mark connection-state=new in-interface=bridge-lan new-connection-mark=ISP1_conn per-connection-classifier=both-addresses:11/5
add action=mark-connection chain=prerouting comment=3_PCC_ISP2_250Mbps_slot6 connection-mark=no-mark connection-state=new in-interface=bridge-lan new-connection-mark=ISP2_conn per-connection-classifier=both-addresses:11/6
add action=mark-connection chain=prerouting comment=3_PCC_ISP2_250Mbps_slot7 connection-mark=no-mark connection-state=new in-interface=bridge-lan new-connection-mark=ISP2_conn per-connection-classifier=both-addresses:11/7
add action=mark-connection chain=prerouting comment=3_PCC_ISP2_250Mbps_slot8 connection-mark=no-mark connection-state=new in-interface=bridge-lan new-connection-mark=ISP2_conn per-connection-classifier=both-addresses:11/8
add action=mark-connection chain=prerouting comment=3_PCC_ISP2_250Mbps_slot9 connection-mark=no-mark connection-state=new in-interface=bridge-lan new-connection-mark=ISP2_conn per-connection-classifier=both-addresses:11/9
add action=mark-connection chain=prerouting comment=3_PCC_ISP2_250Mbps_slot10 connection-mark=no-mark connection-state=new in-interface=bridge-lan new-connection-mark=ISP2_conn per-connection-classifier=both-addresses:11/10

add action=mark-routing chain=prerouting comment=4_Routing_ISP1 connection-mark=ISP1_conn in-interface=bridge-lan new-routing-mark=to_ISP1 passthrough=no
add action=mark-routing chain=prerouting comment=4_Routing_ISP2 connection-mark=ISP2_conn in-interface=bridge-lan new-routing-mark=to_ISP2 passthrough=no

# Cleaned up Output rules (replaced by new rules above, but keeping for safety if user merges)
# add action=mark-routing chain=output comment=5_Output_Routing_ISP1 connection-mark=ISP1_conn new-routing-mark=to_ISP1 passthrough=no
# add action=mark-routing chain=output comment=5_Output_Routing_ISP2 connection-mark=ISP2_conn new-routing-mark=to_ISP2 passthrough=no

add action=change-mss chain=forward comment=6_Fix_MSS_Auto new-mss=clamp-to-pmtu protocol=tcp tcp-flags=syn
/ip firewall nat
add action=redirect chain=dstnat comment="FORCE DNS ke Router" dst-port=53 protocol=udp src-address=10.10.10.0/24 to-ports=53
add action=redirect chain=dstnat comment="FORCE DNS ke Router TCP" dst-port=53 protocol=tcp src-address=10.10.10.0/24 to-ports=53
add action=masquerade chain=srcnat comment="NAT ISP1" out-interface=ether1
add action=masquerade chain=srcnat comment="NAT ISP2" out-interface=ether2
/ip firewall raw
add action=drop chain=prerouting comment="Early Drop DNS from WAN" dst-port=53 in-interface-list=WAN protocol=udp
add action=drop chain=prerouting comment="Early Drop DNS from WAN TCP" dst-port=53 in-interface-list=WAN protocol=tcp
/ip route
add check-gateway=ping comment=Jalur_Main_ISP1 disabled=no distance=1 gateway=192.168.1.1 routing-table=main
add check-gateway=ping comment=Jalur_Main_ISP2 disabled=no distance=2 gateway=192.168.166.1 routing-table=main
add comment=Jalur_PCC_ISP1 disabled=no distance=1 gateway=192.168.1.1 routing-table=to_ISP1
add comment=Jalur_PCC_ISP2 disabled=no distance=1 gateway=192.168.166.1 routing-table=to_ISP2
add comment=Failover_PCC_ke_ISP2 disabled=no distance=2 gateway=192.168.166.1 routing-table=to_ISP1
add comment=Failover_PCC_ke_ISP1 disabled=no distance=2 gateway=192.168.1.1 routing-table=to_ISP2
add comment=Monitor_ISP1_A disabled=no distance=1 dst-address=4.2.2.2/32 gateway=192.168.1.1 scope=10
add comment=Monitor_ISP1_B disabled=no distance=1 dst-address=4.2.2.1/32 gateway=192.168.1.1 scope=10
add comment=Monitor_ISP2_A disabled=no distance=1 dst-address=208.67.222.222/32 gateway=192.168.166.1 scope=10
add comment=Monitor_ISP2_B disabled=no distance=1 dst-address=208.67.220.220/32 gateway=192.168.166.1 scope=10
add blackhole comment=Tong_Sampah disabled=no distance=10 dst-address=0.0.0.0/0
add blackhole comment=Blackhole_Monitor_ISP2_A disabled=no distance=2 dst-address=208.67.222.222/32
add blackhole comment=Blackhole_Monitor_ISP2_B disabled=no distance=2 dst-address=208.67.220.220/32
add blackhole comment=Blackhole_Monitor_ISP1_A distance=2 dst-address=4.2.2.2/32
add blackhole comment=Blackhole_Monitor_ISP1_B distance=2 dst-address=4.2.2.1/32
add blackhole comment="Blackhole to_ISP1" distance=254 routing-table=to_ISP1
add blackhole comment="Blackhole to_ISP2" distance=254 routing-table=to_ISP2
/ip service
set ftp disabled=yes
set telnet disabled=yes
set www-ssl certificate=*1 port=8443
set api disabled=yes
set api-ssl disabled=yes
/system clock
set time-zone-name=Asia/Jakarta
/system identity
set name=RB450Gx4-LoadBalance
/system logging
add action=failover prefix="[FAILOVER]" topics=script
add action=firewall topics=firewall
/system ntp client
set enabled=yes
/system ntp server
set broadcast=yes enabled=yes
/system ntp client servers
add address=202.65.114.202 comment="id.pool.ntp.org - 1"
add address=103.127.196.226 comment="id.pool.ntp.org - 2"
/system package update
set channel=testing
/system scheduler
add comment="Init global vars saat boot" name=startup_init on-event="/system script run initGlobalVars" policy=read,write,test start-time=startup
/system script
add dont-require-permissions=yes name=initGlobalVars owner=admin policy=read,write,test source=":global ISP1Status \"up\"\r\
    \n:global ISP2Status \"up\"\r\
    \n:log info \"Global Variables Initialized: ISP1=\$ISP1Status, ISP2=\$ISP2Status\""
add dont-require-permissions=yes name=setQueueLimit owner=admin policy=read,write,test source=":global ISP1Status\
    \n:global ISP2Status\
    \n:local queueName \"01_Total_Office_CAKE\"\
    \n:local newLimit \"\"\
    \n:if ([:typeof \$ISP1Status] = \"nothing\") do={ :set ISP1Status \"up\" }\
    \n:if ([:typeof \$ISP2Status] = \"nothing\") do={ :set ISP2Status \"up\" }\
    \n:if (\$ISP1Status = \"up\" && \$ISP2Status = \"up\") do={\
    \n    :set newLimit \"550M/550M\"\
    \n    :log info \"QUEUE: Full Load - 550M\"\
    \n}\
    \n:if (\$ISP1Status = \"up\" && \$ISP2Status = \"down\") do={\
    \n    :set newLimit \"300M/300M\"\
    \n    :log warning \"QUEUE: ISP1 Only - 300M\"\
    \n}\
    \n:if (\$ISP1Status = \"down\" && \$ISP2Status = \"up\") do={\
    \n    :set newLimit \"250M/250M\"\
    \n    :log warning \"QUEUE: ISP2 Only - 250M\"\
    \n}\
    \n:if (\$ISP1Status = \"down\" && \$ISP2Status = \"down\") do={\
    \n    :set newLimit \"1M/1M\"\
    \n    :log error \"QUEUE: ALL ISP DOWN - 1M\"\
    \n}\
    \n:local current [/queue simple get [find name=\$queueName] max-limit]\
    \n:if (\$current != \$newLimit) do={\
    \n    /queue simple set [find name=\$queueName] max-limit=\$newLimit\
    \n    :log info \"QUEUE: Changed to \$newLimit\"\
    \n}"
add dont-require-permissions=yes name=ISP1_Down owner=admin policy=read,write,test source=":global ISP1Status\
    \n# Guard clause - skip jika sudah down\
    \n:if (\$ISP1Status = \"down\") do={\
    \n    :log info \"ISP1_Down: Already DOWN, skipping\"\
    \n    :return\
    \n}\
    \n:set ISP1Status \"down\"\
    \n:log error \"ISP1 TOTAL DOWN!\"\
    \n:do { /ip route set [find comment=\"Jalur_Main_ISP1\"] disabled=yes } on-error={ :log error \"Failed: disable Jalur_Main_ISP1\" }\
    \n:do { /ip route set [find comment=\"Jalur_PCC_ISP1\"] disabled=yes } on-error={ :log error \"Failed: disable Jalur_PCC_ISP1\" }\
    \n:do { /ip firewall connection remove [find connection-mark=\"ISP1_conn\"] } on-error={ :log warning \"No ISP1 connections to clear\" }\
    \n/system script run setQueueLimit"
add dont-require-permissions=yes name=ISP1_Up owner=admin policy=read,write,test source=":global ISP1Status\
    \n# Guard clause - skip jika sudah up\
    \n:if (\$ISP1Status = \"up\") do={\
    \n    :log info \"ISP1_Up: Already UP, skipping\"\
    \n    :return\
    \n}\
    \n:set ISP1Status \"up\"\
    \n:log info \"ISP1 UP Kembali!\"\
    \n:do { /ip route set [find comment=\"Jalur_Main_ISP1\"] disabled=no } on-error={ :log error \"Failed: enable Jalur_Main_ISP1\" }\
    \n:do { /ip route set [find comment=\"Jalur_PCC_ISP1\"] disabled=no } on-error={ :log error \"Failed: enable Jalur_PCC_ISP1\" }\
    \n# CHANGED: Don't clear connections on UP, let them flow naturally\
    \n# :do { /ip firewall connection remove [find connection-mark=\"ISP1_conn\"] } on-error={}\
    \n/system script run setQueueLimit"
add dont-require-permissions=yes name=ISP2_Down owner=admin policy=read,write,test source=":global ISP2Status\
    \n# Guard clause\
    \n:if (\$ISP2Status = \"down\") do={\
    \n    :log info \"ISP2_Down: Already DOWN, skipping\"\
    \n    :return\
    \n}\
    \n:set ISP2Status \"down\"\
    \n:log error \"ISP2 TOTAL DOWN!\"\
    \n:do { /ip route set [find comment=\"Jalur_Main_ISP2\"] disabled=yes } on-error={ :log error \"Failed: disable Jalur_Main_ISP2\" }\
    \n:do { /ip route set [find comment=\"Jalur_PCC_ISP2\"] disabled=yes } on-error={ :log error \"Failed: disable Jalur_PCC_ISP2\" }\
    \n:do { /ip firewall connection remove [find connection-mark=\"ISP2_conn\"] } on-error={ :log warning \"No ISP2 connections to clear\" }\
    \n/system script run setQueueLimit"
add dont-require-permissions=yes name=ISP2_Up owner=admin policy=read,write,test source=":global ISP2Status\
    \n# Guard clause\
    \n:if (\$ISP2Status = \"up\") do={\
    \n    :log info \"ISP2_Up: Already UP, skipping\"\
    \n    :return\
    \n}\
    \n:set ISP2Status \"up\"\
    \n:log info \"ISP2 UP Kembali!\"\
    \n:do { /ip route set [find comment=\"Jalur_Main_ISP2\"] disabled=no } on-error={ :log error \"Failed: enable Jalur_Main_ISP2\" }\
    \n:do { /ip route set [find comment=\"Jalur_PCC_ISP2\"] disabled=no } on-error={ :log error \"Failed: enable Jalur_PCC_ISP2\" }\
    \n# CHANGED: Don't clear connections on UP\
    \n# :do { /ip firewall connection remove [find connection-mark=\"ISP2_conn\"] } on-error={}\
    \n/system script run setQueueLimit"
/tool graphing interface
add interface=bridge-lan
/tool graphing queue
add
/tool graphing resource
add
/tool netwatch
add comment=ISP1_Check_A down-script=":local T \"4.2.2.1\"\r\
    \n:if ([/tool netwatch get [find host=\$T] status]=\"down\") do={ /system script run ISP1_Down } else={ :log warning \"ISP1: 4.2.2.2 RTO, tapi 4.2.2.1 Hidup\" }" host=4.2.2.2 interval=10s src-address=192.168.1.10 timeout=5s type=simple up-script="/system script run ISP1_Up"
add comment=ISP1_Check_B down-script=":local T \"4.2.2.2\"\r\
    \n:if ([/tool netwatch get [find host=\$T] status]=\"down\") do={ /system script run ISP1_Down } else={ :log warning \"ISP1: 4.2.2.1 RTO, tapi 4.2.2.2 Hidup\" }" host=4.2.2.1 interval=10s src-address=192.168.1.10 timeout=5s type=simple up-script="/system script run ISP1_Up"
add comment=ISP2_Check_A down-script=":local T \"208.67.220.220\"\r\
    \n:if ([/tool netwatch get [find host=\$T] status]=\"down\") do={ /system script run ISP2_Down } else={ :log warning \"ISP2: 208.67.222.222 RTO, tapi 208.67.220.220 Hidup\" }" host=208.67.222.222 interval=10s src-address=192.168.166.2 timeout=5s type=simple up-script="/system script run ISP2_Up"
add comment=ISP2_Check_B down-script=":local T \"208.67.222.222\"\r\
    \n:if ([/tool netwatch get [find host=\$T] status]=\"down\") do={ /system script run ISP2_Down } else={ :log warning \"ISP2: 208.67.220.220 RTO, tapi 208.67.222.222 Hidup\" }" host=208.67.220.220 interval=10s src-address=192.168.166.2 timeout=5s type=simple up-script="/system script run ISP2_Up"
