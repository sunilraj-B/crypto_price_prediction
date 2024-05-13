from django.db import migrations, models

class Migration(migrations.Migration):

    initial = True

    dependencies = [
        # Add dependencies if any
    ]

    operations = [
        migrations.CreateModel(
            name='Profile',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('bio', models.TextField(blank=True)),
                ('location', models.CharField(max_length=100, blank=True)),
                ('user', models.OneToOneField(on_delete=models.CASCADE, to='auth.User')),
            ],
        ),
    ]
