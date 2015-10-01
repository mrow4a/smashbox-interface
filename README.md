#INSTALLATION

1. In "/var/www/" clone repository and execute "sudo mv smashbox-interface smashbox"
2. sudo a2dissite 000-default.conf
3. At "/etc/apache2/sites-available/" create file "smashbox.com.conf"
4. Insert that inside the file
"</br>
<VirtualHost *:80></br>
     ServerAdmin webmaster@smashbox.com</br>
     ServerName smashbox.com</br>
     ServerAlias www.smashbox.com</br>
     DocumentRoot /var/www/smashbox/public_html/</br>
     ScriptAlias /test /var/www/smashbox/cgi-bin</br>
     <Directory "/var/www/smashbox/cgi-bin"></br>
     &#09;   AllowOverride None</br>
     &#09;   Options +ExecCGI -MultiViews +SymLinksIfOwnerMatch</br>
     &#09;   Require all granted</br>
     &#09;   AddHandler cgi-script .pl .py</br>
     </Directory></br>
     ErrorLog /var/www/smashbox/logs/error.log</br>
     CustomLog /var/www/smashbox/logs/access.log combined</br>
</VirtualHost></br>
"</br>
1. Next - "sudo a2ensite smashbox.com.conf"
2. sudo pip install pyocclient
3. sudo chown -R www-data:www-data /var/www/smashbox
4. go to cgi-bin and "sudo chmod 755 smashbox.py"
5. sudo a2enmod cgi
6. sudo service apache2 restart
