from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.contrib.auth.forms import UserCreationForm, UserChangeForm
from django.utils.translation import gettext_lazy as _
from django import forms

from .models import (
    User,
    Social,
    Settings,
    Education,
    Contact,
    Experience,
    Category,
    Article,
    Skill,
    SocialType
)

class CustomUserCreationForm(UserCreationForm):
    """Formulaire de création d'utilisateur personnalisé"""
    class Meta:
        model = User
        fields = ('email', 'username', 'first_name', 'last_name')


class CustomUserChangeForm(UserChangeForm):
    """Formulaire de modification d'utilisateur personnalisé"""
    class Meta:
        model = User
        fields = '__all__'


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    # Formulaires personnalisés
    add_form = CustomUserCreationForm
    form = CustomUserChangeForm
    model = User
    
    # Champs affichés dans la liste des utilisateurs
    list_display = (
        'email', 'username', 'first_name', 'last_name', 
        'is_verified', 'is_staff', 'is_active', 'created_at'
    )
    
    # Champs sur lesquels on peut faire une recherche
    search_fields = ('email', 'username', 'first_name', 'last_name')
    
    # Filtres dans la barre latérale
    list_filter = (
        'is_staff', 'is_superuser', 'is_active', 
        'is_verified', 'country', 'created_at'
    )
    
    # Tri par défaut
    ordering = ('-created_at',)
    
    # Champs modifiables directement dans la liste
    list_editable = ('is_verified', 'is_active')
    
    # Configuration des fieldsets pour le formulaire de modification
    fieldsets = (
        (None, {
            'fields': ('email', 'password')
        }),
        (_('Informations personnelles'), {
            'fields': ('username', 'first_name', 'last_name', 'bio')
        }),
        (_('Images'), {
            'fields': ('profile_image', 'banner'),
            'classes': ('collapse',)
        }),
        (_('Adresse'), {
            'fields': ('country', 'city', 'postal_code', 'street', 'house_number'),
            'classes': ('collapse',)
        }),
        (_('Contact'), {
            'fields': ('phone_number',),
            'classes': ('collapse',)
        }),
        (_('Permissions'), {
            'fields': ('is_active', 'is_staff', 'is_superuser', 'is_verified', 
                      'groups', 'user_permissions'),
            'classes': ('collapse',)
        }),
        (_('Dates importantes'), {
            'fields': ('last_login', 'date_joined', 'created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    # Configuration pour le formulaire d'ajout d'utilisateur
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'username', 'first_name', 'last_name', 
                      'password1', 'password2', 'is_staff', 'is_active', 'is_verified'),
        }),
    )
    
    # Champs en lecture seule
    readonly_fields = ('created_at', 'updated_at', 'last_login', 'date_joined')
    
    # Actions personnalisées
    actions = ['activate_users', 'deactivate_users', 'verify_users', 'unverify_users']
    
    def activate_users(self, request, queryset):
        """Action pour activer des utilisateurs"""
        updated = queryset.update(is_active=True)
        self.message_user(request, f'{updated} utilisateur(s) activé(s).')
    activate_users.short_description = "Activer les utilisateurs sélectionnés"
    
    def deactivate_users(self, request, queryset):
        """Action pour désactiver des utilisateurs"""
        updated = queryset.update(is_active=False)
        self.message_user(request, f'{updated} utilisateur(s) désactivé(s).')
    deactivate_users.short_description = "Désactiver les utilisateurs sélectionnés"
    
    def verify_users(self, request, queryset):
        """Action pour vérifier des utilisateurs"""
        updated = queryset.update(is_verified=True)
        self.message_user(request, f'{updated} utilisateur(s) vérifié(s).')
    verify_users.short_description = "Vérifier les utilisateurs sélectionnés"
    
    def unverify_users(self, request, queryset):
        """Action pour dévérifier des utilisateurs"""
        updated = queryset.update(is_verified=False)
        self.message_user(request, f'{updated} utilisateur(s) dévérifié(s).')
    unverify_users.short_description = "Dévérifier les utilisateurs sélectionnés"


@admin.register(Education)
class EducationAdmin(admin.ModelAdmin):
    list_display = ('user', 'description', 'school', 'start_date', 'end_date')
    search_fields = ('user__username',)
    list_per_page = 20
    list_filter = ('user__username',)

@admin.register(Experience)
class ExperienceAdmin(admin.ModelAdmin):
    list_display = ('user', 'company', 'start_date', 'end_date')
    search_fields = ('user__username', 'company')
    list_per_page = 20
    list_filter = ('user__username',)

@admin.register(Social)
class SocialAdmin(admin.ModelAdmin):
    list_display = ('user', 'social_type', 'link')
    search_fields = ('user__username', 'social_type__label')
    list_per_page = 20
    list_filter = ('social_type', 'user__username')

@admin.register(Skill)
class SkillAdmin(admin.ModelAdmin):
    list_display = ('user', 'label')
    search_fields = ('user__username', 'label')
    list_per_page = 20
    list_filter = ('user__username',)


@admin.register(Settings)
class SettingsAdmin(admin.ModelAdmin):
    list_display = ('user', 'color')
    search_fields = ('user__username',)
    list_per_page = 20
    list_filter = ('user__username',)


@admin.register(Contact)
class ContactAdmin(admin.ModelAdmin):
    list_display = ('user', 'email', 'message')
    search_fields = ('user__username', 'email')
    list_per_page = 20
    list_filter = ('user__username', 'email')



@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('name',)
    search_fields = ('name',)
    list_per_page = 20

@admin.register(Article)
class ArticleAdmin(admin.ModelAdmin):
    list_display = ('title', 'category', 'content', 'coverage_image', 'is_published' , 'created_at')
    search_fields = ('title', 'category__name')
    list_per_page = 20
    list_filter = ('is_published', 'category', 'created_at', 'user__username')

@admin.register(SocialType)
class SocialTypeAdmin(admin.ModelAdmin):
    list_display = ('label',)
    search_fields = ('label',)
    list_per_page = 20


# Configuration optionnelle : personnaliser l'en-tête de l'admin
admin.site.site_header = "Administration portfolio"
admin.site.site_title = "Admin"
admin.site.index_title = "Panneau d'administration"