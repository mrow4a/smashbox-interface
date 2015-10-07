#INSTALLATION

1. In "/var/www/" clone repository and execute "sudo mv smashbox-interface smashbox"
2. sudo a2dissite 000-default.conf
3. At "/etc/apache2/sites-available/" create file "smashbox.com.conf"
4. Insert that inside the file</br>
```
<VirtualHost *:80>
     ServerAdmin webmaster@smashbox.com
     ServerName smashbox.com
     ServerAlias www.smashbox.com
     DocumentRoot /var/www/smashbox/public_html/
     ScriptAlias /test /var/www/smashbox/cgi-bin
     <Directory "/var/www/smashbox/cgi-bin">
        AllowOverride None
        Options +ExecCGI -MultiViews +SymLinksIfOwnerMatch
        Require all granted
        AddHandler cgi-script .pl .py
     </Directory>
     ErrorLog /var/www/smashbox/logs/error.log
     CustomLog /var/www/smashbox/logs/access.log combined
</VirtualHost>
```
5. Next - "sudo a2ensite smashbox.com.conf"
6. sudo pip install pyocclient
7. sudo chown -R www-data:www-data /var/www/smashbox
8. go to cgi-bin and "sudo chmod 755 smashbox.py"
9. sudo a2enmod cgi
10. sudo service apache2 restart

#INSTRUCTION

You could run the tests both through the interface and via url e.g.
Command:
```
localhost/test/smashbox.py?function=run&test=[{"unicodejam":[["0","2"]],"fileTinkerDownload":[["0","1"]],"basicSync":[["7","1"]]}]
```
will run:</br>
* unicodejam - scenario 0, looping 2 times</br>
* fileTinkerDownload - scenario 0, looping 1 time</br>
* basicSync - scenario 7, looping 1 time</br>

#CORE SUITE - SMASHBOX
[Read about the smashbox](https://github.com/mrow4a/smashbox/blob/master/README.md) </br>
or visit the page at:</br>
[https://github.com/mrow4a/smashbox](https://github.com/mrow4a/smashbox) </br>
[https://github.com/cernbox/smashbox](https://github.com/cernbox/smashbox) </br>
