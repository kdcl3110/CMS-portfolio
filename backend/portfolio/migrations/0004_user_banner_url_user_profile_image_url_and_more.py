# Generated by Django 4.2.20 on 2025-06-26 11:41

from django.db import migrations, models
import portfolio.models.user


class Migration(migrations.Migration):

    dependencies = [
        ('portfolio', '0003_socialtype_logo_url_alter_socialtype_label_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='user',
            name='banner_url',
            field=models.URLField(blank=True, help_text='URL de la bannière (généré automatiquement après upload ou URL externe)', null=True),
        ),
        migrations.AddField(
            model_name='user',
            name='profile_image_url',
            field=models.URLField(blank=True, help_text="URL de l'image de profil (généré automatiquement après upload ou URL externe)", null=True),
        ),
        migrations.AlterField(
            model_name='user',
            name='banner',
            field=models.ImageField(blank=True, help_text='Image de bannière (formats supportés: PNG, JPG, JPEG, WebP)', null=True, upload_to=portfolio.models.user.user_banner_upload_path),
        ),
        migrations.AlterField(
            model_name='user',
            name='profile_image',
            field=models.ImageField(blank=True, help_text='Image de profil (formats supportés: PNG, JPG, JPEG, WebP)', null=True, upload_to=portfolio.models.user.user_profile_image_upload_path),
        ),
    ]
