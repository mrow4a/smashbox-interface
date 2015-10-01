#INSTALLATION
1. create git init in "/var/www"
2. clone repository and execute "sudo mv smashbox-interface smashbox"
3. "sudo a2dissite 000-default.conf"
4. At "/etc/apache2/sites-available/" create file "smashbox.com.conf"
5. Insert that inside the file

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

6. "sudo a2ensite smashbox.com.conf"
7. "sudo service apache2 restart"
