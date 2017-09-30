<?php
    date_default_timezone_set('UTC');

	include "db_cred.php";
    function query($obj, $query, $argv = array())
    {
        $stmt = $obj->prepare($query);
        $return = (!empty($argv) ? $stmt->execute((array)$argv) : $stmt->execute());
        if (!$return) {
            echo "\nPDO::errorInfo():\n";
            exit(var_dump(($obj->errorInfo())));
        }
        return $stmt;
    }
    try {
        $db = new PDO("mysql:dbname={$db_info["dbName"]};charset=utf8", $db_info["dbUser"], $db_info["dbPass"], array(PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION));

        $ip = $_SERVER["REMOTE_ADDR"];

        switch (true) {
            case filter_var($ip, FILTER_VALIDATE_IP, FILTER_FLAG_IPV4):
                $ip = "inet_aton(\"$ip\")";
                break;
            case filter_var($ip, FILTER_VALIDATE_IP, FILTER_FLAG_IPV6):
                $ip = "inet_pton(\"$ip\")";
                break;
            default:
                break;
        }

        function getCount()
        {
            global $db;
            try {
                $result = query($db, "select count(*) from submit_count")->fetch();
                return json_encode(
                ["status" => true,
                "msg" => "",
                "count" => (int)$result[0]]
            );
            } catch (Exception $e) {
                return json_encode(
                    ["status" => false,
                    "msg" => $db->errorInfo(),
                    "count" => (int)$result[0]]
                );
            }
        }

        function jail($length = 3600, $reason = 0)
        {
            global $db, $ip;
            try {
                $result = query($db, "insert into jail (ip, unbanTime, reason) values ($ip, ?, ?)", [date("Y-m-d H:i:s", strtotime("+$length seconds")), $reason]);
            } catch (Exception $e) {
                exit(
                json_encode(
                        ["status" => false, "msg" => $e->getMessage()]
                    )
                );
            } finally {
                exit(
                json_encode(
                        ["status" => false, "msg" => "Invalid request. <i>Don't be a evil friend."    ]
                    )
                );
            }
        }
        function startsWith($haystack, $needle)
        {
            return $needle === "" || (strrpos($haystack, $needle, - strlen($haystack)) !== false);
        }
        $reason = [
            "Suspected Hacking",
            "Abusive behavior"
        ];
        $jail = query($db, "select * from jail where now() between banTime and unbanTime and ip = $ip order by unbanTime desc")->fetchAll();
        $jailCount = count($jail);
        if ($jailCount > 0) {
            $forever = (int)query($db, "select count(*) from jail where ip = $ip")->fetch()[0];
            if ($forever > 3) {
                jail(86400*(2^$forever));
            }
            exit(json_encode(
                ["status" => false,
                "msg" => "You have been jailed until UTC ".$jail[0]["unbanTime"]." due to ".$reason[(int)$jail[0]["reason"]].". Sorry for any inconvenience."]
            ));
        }
        if (empty($_SERVER["HTTP_REFERER"]) || !startsWith($_SERVER["HTTP_REFERER"], "http://".$_SERVER['HTTP_HOST'])) {
            jail(3600, 0);
        }

        if (isset($_POST["getCount"])) { // for getting analytics
            exit(getCount());
        } else { // TODO: implement cookie
            $interval = "1 minute";
            $allow = 15;
            $count = query($db, "select count(*) from submit_count where timestamp between date_sub(now(), interval $interval) and date_add(now(), interval $interval)")->fetch()[0];
            if ((int)$count > $allow) {
                try {
                    $jailCount = query($db, "select count(*) from jail where ip = $ip")->fetch()[0];
                    $jailCount = ($jailCount < 0 ? 1 : $jailCount);
                } catch (Exception $e) {
                } finally {
                    jail(5*60*(isset($jailCount) ? $jailCount : 1), 1);
                }
            }

            $result = query($db, "insert into submit_count (ip_address) values ($ip)");
            if ($result) {
                exit(getCount());
            } else {
                exit(
                json_encode(
                        ["status" => false, "msg" => $db->errorInfo()]
                    )
                );
            }
        }
    } catch (Exception $e) {
        exit(
            json_encode(
                ["status" => false, "msg" => $e->getMessage()." thrown on line ".$e->getLine()]
                )
            );
    }
