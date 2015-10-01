#INSTALLATION

1. In "/var/www/" clone repository and execute "sudo mv smashbox-interface smashbox"
2. sudo a2dissite 000-default.conf
3. At "/etc/apache2/sites-available/" create file "smashbox.com.conf"
4. Insert that inside the file</br>
<pre><blockquote>
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
</blockquote></pre>
1. Next - "sudo a2ensite smashbox.com.conf"
2. sudo pip install pyocclient
3. sudo chown -R www-data:www-data /var/www/smashbox
4. go to cgi-bin and "sudo chmod 755 smashbox.py"
5. sudo a2enmod cgi
6. sudo service apache2 restart
