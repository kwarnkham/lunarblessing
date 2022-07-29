```
scp spa.zip root@2d3d.madewithheart.tech:/root/
rm -r backup/* && mv ./* backup
mv /root/spa.zip ./spa.zip && unzip spa.zip && rm spa.zip && mv spa/* ./ && rm -r spa
systemctl restart nginx
```
