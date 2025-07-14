from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.contrib.auth.forms import UserCreationForm, UserChangeForm
from django.utils.translation import gettext_lazy as _
from django.utils.html import format_html
from django.urls import reverse
from django.utils.safestring import mark_safe
from django.utils import timezone
from django import forms
import os

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
    SocialType,
    Project,
    Service
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
        'profile_image_preview', 'is_verified', 'is_staff', 'is_active', 'created_at_safe'
    )
    
    # Champs sur lesquels on peut faire une recherche
    search_fields = ('email', 'username', 'first_name', 'last_name')
    
    # Filtres dans la barre latérale
    list_filter = (
        'is_staff', 'is_superuser', 'is_active', 
        'is_verified', 'country'
    )
    
    # Tri par défaut
    ordering = ('-id',)  # Changé de created_at vers id pour éviter les problèmes
    
    # Champs modifiables directement dans la liste
    list_editable = ('is_verified', 'is_active')
    
    # Configuration des fieldsets pour le formulaire de modification
    fieldsets = (
        (None, {
            'fields': ('email', 'password')
        }),
        (_('Informations personnelles'), {
            'fields': ('username', 'first_name', 'last_name', 'brief_description', 'bio')
        }),
        (_('Images'), {
            'fields': ('profile_image', 'profile_image_url', 'banner', 'banner_url'),
            'classes': ('collapse',),
            'description': 'Les URLs sont générées automatiquement après upload'
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
            'fields': ('last_login', 'date_joined', 'created_at_safe', 'updated_at_safe'),
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
    readonly_fields = ('profile_image_url', 'banner_url', 'created_at_safe', 'updated_at_safe', 'last_login', 'date_joined')
    
    # Actions personnalisées
    actions = ['activate_users', 'deactivate_users', 'verify_users', 'unverify_users']
    
    def created_at_safe(self, obj):
        """Affichage sécurisé de la date de création"""
        try:
            if obj.created_at:
                if timezone.is_naive(obj.created_at):
                    aware_datetime = timezone.make_aware(obj.created_at)
                else:
                    aware_datetime = obj.created_at
                return aware_datetime.strftime("%d/%m/%Y %H:%M")
            return "Non défini"
        except (ValueError, TypeError):
            return "Date invalide"
    created_at_safe.short_description = "Créé le"
    created_at_safe.admin_order_field = 'created_at'
    
    def updated_at_safe(self, obj):
        """Affichage sécurisé de la date de mise à jour"""
        try:
            if obj.updated_at:
                if timezone.is_naive(obj.updated_at):
                    aware_datetime = timezone.make_aware(obj.updated_at)
                else:
                    aware_datetime = obj.updated_at
                return aware_datetime.strftime("%d/%m/%Y %H:%M")
            return "Non défini"
        except (ValueError, TypeError):
            return "Date invalide"
    updated_at_safe.short_description = "Modifié le"
    updated_at_safe.admin_order_field = 'updated_at'
    
    def profile_image_preview(self, obj):
        """Aperçu de l'image de profil dans la liste"""
        if obj.profile_image:
            return format_html(
                '<img src="{}" width="30" height="30" style="border-radius: 50%; border: 1px solid #ddd;" title="{}"/>',
                obj.profile_image.url,
                obj.username
            )
        return format_html('<div style="width: 30px; height: 30px; background-color: #f0f0f0; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 12px; color: #888;">👤</div>')
    profile_image_preview.short_description = "Avatar"
    
    def get_readonly_fields(self, request, obj=None):
        """Rendre les URLs en lecture seule"""
        readonly = list(super().get_readonly_fields(request, obj))
        if obj:  # Si on modifie un utilisateur existant
            readonly.extend(['profile_image_url', 'banner_url'])
        return readonly
    
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
    list_display = ('user', 'title', 'school', 'description_short', 'start_date', 'end_date', 'is_current')
    search_fields = ('user__username', 'user__email', 'school', 'description', 'title')
    list_per_page = 20
    list_filter = ('start_date', 'end_date', 'school')
    # date_hierarchy = 'start_date'  # Commenté temporairement
    
    def description_short(self, obj):
        """Affichage tronqué de la description"""
        return obj.description[:50] + "..." if len(obj.description) > 50 else obj.description
    description_short.short_description = "Description"
    
    def is_current(self, obj):
        """Indique si la formation est en cours"""
        return obj.end_date is None
    is_current.boolean = True
    is_current.short_description = "En cours"


@admin.register(Experience)
class ExperienceAdmin(admin.ModelAdmin):
    list_display = ('user', 'title', 'company', 'description_short', 'start_date', 'end_date', 'is_current')
    search_fields = ('user__username', 'user__email', 'company', 'description', 'title')
    list_per_page = 20
    list_filter = ('start_date', 'end_date', 'company')
    # date_hierarchy = 'start_date'  # Commenté temporairement
    
    def description_short(self, obj):
        """Affichage tronqué de la description"""
        return obj.description[:50] + "..." if len(obj.description) > 50 else obj.description
    description_short.short_description = "Description"
    
    def is_current(self, obj):
        """Indique si l'expérience est en cours"""
        return obj.end_date is None
    is_current.boolean = True
    is_current.short_description = "En cours"


@admin.register(Social)
class SocialAdmin(admin.ModelAdmin):
    list_display = ('user', 'social_type', 'social_type_logo_display', 'link_display', 'created_at_safe')
    search_fields = ('user__username', 'user__email', 'social_type__label', 'link')
    list_per_page = 20
    list_filter = ('social_type',)  # Enlevé created_at du filtre
    # date_hierarchy = 'created_at'  # Commenté pour éviter l'erreur timezone
    
    def get_queryset(self, request):
        """Override queryset pour optimiser les requêtes"""
        qs = super().get_queryset(request)
        return qs.select_related('social_type', 'user')
    
    def created_at_safe(self, obj):
        """Affichage sécurisé de la date de création"""
        try:
            if obj.created_at:
                if timezone.is_naive(obj.created_at):
                    aware_datetime = timezone.make_aware(obj.created_at)
                else:
                    aware_datetime = obj.created_at
                return aware_datetime.strftime("%d/%m/%Y %H:%M")
            return "Non défini"
        except (ValueError, TypeError):
            return "Date invalide"
    created_at_safe.short_description = "Créé le"
    created_at_safe.admin_order_field = 'created_at'
    
    def social_type_logo_display(self, obj):
        """Affiche le logo du type de réseau social"""
        try:
            if obj.social_type and obj.social_type.logo:
                return format_html(
                    '<img src="{}" width="30" height="30" style="border-radius: 50%;" />',
                    obj.social_type.logo.url
                )
            elif obj.social_type and obj.social_type.logo_url:
                return format_html(
                    '<img src="{}" width="30" height="30" style="border-radius: 50%;" />',
                    obj.social_type.logo_url
                )
            return "Pas de logo"
        except Exception:
            return "Erreur logo"
    social_type_logo_display.short_description = "Logo"
    
    def link_display(self, obj):
        """Affiche le lien sous forme de lien cliquable"""
        if obj.link:
            return format_html(
                '<a href="{}" target="_blank" style="color: #007cba;">🔗 Voir le profil</a>',
                obj.link
            )
        return "Pas de lien"
    link_display.short_description = "Lien"


@admin.register(Skill)
class SkillAdmin(admin.ModelAdmin):
    list_display = ('user', 'label', 'created_at_safe')
    search_fields = ('user__username', 'user__email', 'label')
    list_per_page = 20
    list_filter = ('label',)  # Enlevé created_at du filtre
    # date_hierarchy = 'created_at'  # Commenté temporairement
    
    def created_at_safe(self, obj):
        """Affichage sécurisé de la date de création"""
        try:
            if obj.created_at:
                if timezone.is_naive(obj.created_at):
                    aware_datetime = timezone.make_aware(obj.created_at)
                else:
                    aware_datetime = obj.created_at
                return aware_datetime.strftime("%d/%m/%Y %H:%M")
            return "Non défini"
        except (ValueError, TypeError):
            return "Date invalide"
    created_at_safe.short_description = "Créé le"
    created_at_safe.admin_order_field = 'created_at'

@admin.register(Service)
class ServiceAdmin(admin.ModelAdmin):
    list_display = ('title', 'user', 'price_display', 'duration_display', 'is_active', 'icon_preview', 'tags_display', 'created_at_safe')
    search_fields = ('title', 'description', 'user__username', 'user__email')
    list_per_page = 20
    list_filter = ('is_active', 'user')
    list_editable = ('is_active',)
    ordering = ['-created_at']
    
    fieldsets = (
        ('Informations de base', {
            'fields': ('user', 'title', 'description', 'is_active')
        }),
        ('Icône', {
            'fields': ('icon', 'icon_url'),
            'description': 'L\'URL est générée automatiquement après upload'
        }),
        ('Tarification', {
            'fields': ('price', 'duration_hours'),
            'description': 'Prix en euros et durée en heures'
        }),
        ('Catégorisation', {
            'fields': ('tags',),
            'description': 'Tags au format JSON (ex: ["web", "design", "mobile"])'
        }),
        ('Métadonnées', {
            'fields': ('created_at_safe', 'updated_at_safe'),
            'classes': ('collapse',)
        }),
    )
    
    readonly_fields = ('icon_url', 'created_at_safe', 'updated_at_safe')
    
    def created_at_safe(self, obj):
        """Affichage sécurisé de la date de création"""
        try:
            if obj.created_at:
                if timezone.is_naive(obj.created_at):
                    aware_datetime = timezone.make_aware(obj.created_at)
                else:
                    aware_datetime = obj.created_at
                return aware_datetime.strftime("%d/%m/%Y %H:%M")
            return "Non défini"
        except (ValueError, TypeError):
            return "Date invalide"
    created_at_safe.short_description = "Créé le"
    created_at_safe.admin_order_field = 'created_at'
    
    def updated_at_safe(self, obj):
        """Affichage sécurisé de la date de mise à jour"""
        try:
            if obj.updated_at:
                if timezone.is_naive(obj.updated_at):
                    aware_datetime = timezone.make_aware(obj.updated_at)
                else:
                    aware_datetime = obj.updated_at
                return aware_datetime.strftime("%d/%m/%Y %H:%M")
            return "Non défini"
        except (ValueError, TypeError):
            return "Date invalide"
    updated_at_safe.short_description = "Modifié le"
    updated_at_safe.admin_order_field = 'updated_at'
    
    def icon_preview(self, obj):
        """Aperçu de l'icône du service"""
        if obj.icon:
            return format_html(
                '<img src="{}" width="40" height="40" style="border-radius: 8px; object-fit: cover;" />',
                obj.icon.url
            )
        return "Pas d'icône"
    icon_preview.short_description = "Icône"
    
    def tags_display(self, obj):
        """Affichage des tags"""
        if obj.tags_list:
            tags = obj.tags_list[:2]  # Afficher les 2 premiers
            display = ", ".join(tags)
            if len(obj.tags_list) > 2:
                display += f" (+{len(obj.tags_list) - 2})"
            return display
        return "Aucun"
    tags_display.short_description = "Tags"
    
    actions = ['activate_services', 'deactivate_services']
    
    def activate_services(self, request, queryset):
        """Action pour activer les services"""
        updated = queryset.update(is_active=True)
        self.message_user(request, f'{updated} service(s) activé(s).')
    activate_services.short_description = "Activer les services sélectionnés"
    
    def deactivate_services(self, request, queryset):
        """Action pour désactiver les services"""
        updated = queryset.update(is_active=False)
        self.message_user(request, f'{updated} service(s) désactivé(s).')
    deactivate_services.short_description = "Désactiver les services sélectionnés"

@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = ('title', 'user', 'image_preview', 'technologies_display', 'created_at_safe')
    search_fields = ('title', 'description', 'user__username', 'user__email')
    list_per_page = 20
    list_filter = ('user',)
    ordering = ['-created_at']
    
    fieldsets = (
        ('Informations de base', {
            'fields': ('user', 'title', 'description')
        }),
        ('Image', {
            'fields': ('image', 'image_url'),
            'description': 'L\'URL est générée automatiquement après upload'
        }),
        ('Technologies', {
            'fields': ('technologies',),
            'description': 'Liste des technologies au format JSON (ex: ["React", "Django", "PostgreSQL"])'
        }),
        ('URLs', {
            'fields': ('demo_url', 'github_url'),
            'classes': ('collapse',)
        }),
        ('Métadonnées', {
            'fields': ('created_at_safe', 'updated_at_safe'),
            'classes': ('collapse',)
        }),
    )
    
    readonly_fields = ('image_url', 'created_at_safe', 'updated_at_safe')
    
    def created_at_safe(self, obj):
        """Affichage sécurisé de la date de création"""
        try:
            if obj.created_at:
                if timezone.is_naive(obj.created_at):
                    aware_datetime = timezone.make_aware(obj.created_at)
                else:
                    aware_datetime = obj.created_at
                return aware_datetime.strftime("%d/%m/%Y %H:%M")
            return "Non défini"
        except (ValueError, TypeError):
            return "Date invalide"
    created_at_safe.short_description = "Créé le"
    created_at_safe.admin_order_field = 'created_at'
    
    def updated_at_safe(self, obj):
        """Affichage sécurisé de la date de mise à jour"""
        try:
            if obj.updated_at:
                if timezone.is_naive(obj.updated_at):
                    aware_datetime = timezone.make_aware(obj.updated_at)
                else:
                    aware_datetime = obj.updated_at
                return aware_datetime.strftime("%d/%m/%Y %H:%M")
            return "Non défini"
        except (ValueError, TypeError):
            return "Date invalide"
    updated_at_safe.short_description = "Modifié le"
    updated_at_safe.admin_order_field = 'updated_at'
    
    def image_preview(self, obj):
        """Aperçu de l'image du projet"""
        if obj.image:
            return format_html(
                '<img src="{}" width="60" height="40" style="border-radius: 5px; object-fit: cover;" />',
                obj.image.url
            )
        return "Pas d'image"
    image_preview.short_description = "Aperçu"
    
    def technologies_display(self, obj):
        """Affichage des technologies"""
        if obj.technologies_list:
            technologies = obj.technologies_list[:3]  # Afficher les 3 premières
            display = ", ".join(technologies)
            if len(obj.technologies_list) > 3:
                display += f" (+{len(obj.technologies_list) - 3})"
            return display
        return "Aucune"
    technologies_display.short_description = "Technologies"
    
    # actions = ['mark_completed', 'mark_in_progress', 'mark_archived']
    
    # def mark_completed(self, request, queryset):
    #     """Action pour marquer les projets comme terminés"""
    #     updated = queryset.update(status='completed')
    #     self.message_user(request, f'{updated} projet(s) marqué(s) comme terminé(s).')
    # mark_completed.short_description = "Marquer comme terminé"
    
    # def mark_in_progress(self, request, queryset):
    #     """Action pour marquer les projets comme en cours"""
    #     updated = queryset.update(status='in_progress')
    #     self.message_user(request, f'{updated} projet(s) marqué(s) comme en cours.')
    # mark_in_progress.short_description = "Marquer comme en cours"
    
    # def mark_archived(self, request, queryset):
    #     """Action pour archiver les projets"""
    #     updated = queryset.update(status='archived')
    #     self.message_user(request, f'{updated} projet(s) archivé(s).')
    # mark_archived.short_description = "Archiver"


@admin.register(Settings)
class SettingsAdmin(admin.ModelAdmin):
    list_display = ('user', 'color', 'color_preview', 'created_at_safe')
    search_fields = ('user__username', 'user__email')
    list_per_page = 20
    list_filter = ()  # Enlevé created_at du filtre
    
    def created_at_safe(self, obj):
        """Affichage sécurisé de la date de création"""
        try:
            if obj.created_at:
                if timezone.is_naive(obj.created_at):
                    aware_datetime = timezone.make_aware(obj.created_at)
                else:
                    aware_datetime = obj.created_at
                return aware_datetime.strftime("%d/%m/%Y %H:%M")
            return "Non défini"
        except (ValueError, TypeError):
            return "Date invalide"
    created_at_safe.short_description = "Créé le"
    created_at_safe.admin_order_field = 'created_at'
    
    def color_preview(self, obj):
        """Affiche un aperçu de la couleur"""
        if obj.color:
            return format_html(
                '<div style="width: 30px; height: 20px; background-color: {}; border: 1px solid #ccc; border-radius: 3px;"></div>',
                obj.color
            )
        return "Pas de couleur"
    color_preview.short_description = "Aperçu"


@admin.register(Contact)
class ContactAdmin(admin.ModelAdmin):
    list_display = ('user', 'name', 'email', 'message_short', 'read', 'read_status', 'created_at_safe')
    search_fields = ('user__username', 'user__email', 'name', 'email', 'message')
    list_per_page = 20
    list_filter = ('read',)  # Enlevé created_at du filtre
    list_editable = ('read',)
    # date_hierarchy = 'created_at'  # Commenté temporairement
    actions = ['mark_as_read', 'mark_as_unread']
    
    def created_at_safe(self, obj):
        """Affichage sécurisé de la date de création"""
        try:
            if obj.created_at:
                if timezone.is_naive(obj.created_at):
                    aware_datetime = timezone.make_aware(obj.created_at)
                else:
                    aware_datetime = obj.created_at
                return aware_datetime.strftime("%d/%m/%Y %H:%M")
            return "Non défini"
        except (ValueError, TypeError):
            return "Date invalide"
    created_at_safe.short_description = "Créé le"
    created_at_safe.admin_order_field = 'created_at'
    
    def message_short(self, obj):
        """Affichage tronqué du message"""
        return obj.message[:50] + "..." if len(obj.message) > 50 else obj.message
    message_short.short_description = "Message"
    
    def read_status(self, obj):
        """Affichage visuel du statut de lecture"""
        if obj.read:
            return format_html('<span style="color: green;">✓ Lu</span>')
        return format_html('<span style="color: red;">✗ Non lu</span>')
    read_status.short_description = "Statut"
    
    def mark_as_read(self, request, queryset):
        """Action pour marquer comme lu"""
        updated = queryset.update(read=True)
        self.message_user(request, f'{updated} message(s) marqué(s) comme lu(s).')
    mark_as_read.short_description = "Marquer comme lu"
    
    def mark_as_unread(self, request, queryset):
        """Action pour marquer comme non lu"""
        updated = queryset.update(read=False)
        self.message_user(request, f'{updated} message(s) marqué(s) comme non lu(s).')
    mark_as_unread.short_description = "Marquer comme non lu"


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'articles_count', 'created_at_safe')
    search_fields = ('name',)
    list_per_page = 20
    
    def created_at_safe(self, obj):
        """Affichage sécurisé de la date de création"""
        try:
            if obj.created_at:
                if timezone.is_naive(obj.created_at):
                    aware_datetime = timezone.make_aware(obj.created_at)
                else:
                    aware_datetime = obj.created_at
                return aware_datetime.strftime("%d/%m/%Y %H:%M")
            return "Non défini"
        except (ValueError, TypeError):
            return "Date invalide"
    created_at_safe.short_description = "Créé le"
    created_at_safe.admin_order_field = 'created_at'
    
    def articles_count(self, obj):
        """Compte le nombre d'articles dans cette catégorie"""
        return obj.articles.count()
    articles_count.short_description = "Nombre d'articles"


@admin.register(Article)
class ArticleAdmin(admin.ModelAdmin):
    list_display = ('title', 'user', 'category', 'content_short', 'coverage_image_preview', 'is_published', 'created_at_safe')
    search_fields = ('title', 'content', 'category__name', 'user__username')
    list_per_page = 20
    list_filter = ('is_published', 'category', 'user')  # Enlevé created_at du filtre
    list_editable = ('is_published',)
    # date_hierarchy = 'created_at'  # Commenté temporairement
    actions = ['publish_articles', 'unpublish_articles']
    
    def created_at_safe(self, obj):
        """Affichage sécurisé de la date de création"""
        try:
            if obj.created_at:
                if timezone.is_naive(obj.created_at):
                    aware_datetime = timezone.make_aware(obj.created_at)
                else:
                    aware_datetime = obj.created_at
                return aware_datetime.strftime("%d/%m/%Y %H:%M")
            return "Non défini"
        except (ValueError, TypeError):
            return "Date invalide"
    created_at_safe.short_description = "Créé le"
    created_at_safe.admin_order_field = 'created_at'
    
    def content_short(self, obj):
        """Affichage tronqué du contenu"""
        return obj.content[:100] + "..." if len(obj.content) > 100 else obj.content
    content_short.short_description = "Contenu"
    
    def coverage_image_preview(self, obj):
        """Aperçu de l'image de couverture"""
        if obj.coverage_image:
            return format_html(
                '<img src="{}" width="50" height="50" style="border-radius: 5px;" />',
                obj.coverage_image.url
            )
        return "Pas d'image"
    coverage_image_preview.short_description = "Image"
    
    def publish_articles(self, request, queryset):
        """Action pour publier des articles"""
        updated = queryset.update(is_published=True)
        self.message_user(request, f'{updated} article(s) publié(s).')
    publish_articles.short_description = "Publier les articles sélectionnés"
    
    def unpublish_articles(self, request, queryset):
        """Action pour dépublier des articles"""
        updated = queryset.update(is_published=False)
        self.message_user(request, f'{updated} article(s) dépublié(s).')
    unpublish_articles.short_description = "Dépublier les articles sélectionnés"


@admin.register(SocialType)
class SocialTypeAdmin(admin.ModelAdmin):
    list_display = ('label', 'logo_preview', 'logo_url_display', 'socials_count', 'created_at_safe')
    search_fields = ('label',)
    list_per_page = 20
    readonly_fields = ('logo_url', 'created_at_safe', 'updated_at_safe')
    
    fieldsets = (
        ('Informations de base', {
            'fields': ('label',)
        }),
        ('Logo', {
            'fields': ('logo', 'logo_url'),
            'description': 'Uploadez un logo ou l\'URL sera générée automatiquement'
        }),
        ('Métadonnées', {
            'fields': ('created_at_safe', 'updated_at_safe'),
            'classes': ('collapse',)
        }),
    )
    
    def created_at_safe(self, obj):
        """Affichage sécurisé de la date de création"""
        try:
            if obj.created_at:
                if timezone.is_naive(obj.created_at):
                    aware_datetime = timezone.make_aware(obj.created_at)
                else:
                    aware_datetime = obj.created_at
                return aware_datetime.strftime("%d/%m/%Y %H:%M")
            return "Non défini"
        except (ValueError, TypeError):
            return "Date invalide"
    created_at_safe.short_description = "Créé le"
    created_at_safe.admin_order_field = 'created_at'
    
    def updated_at_safe(self, obj):
        """Affichage sécurisé de la date de mise à jour"""
        try:
            if obj.updated_at:
                if timezone.is_naive(obj.updated_at):
                    aware_datetime = timezone.make_aware(obj.updated_at)
                else:
                    aware_datetime = obj.updated_at
                return aware_datetime.strftime("%d/%m/%Y %H:%M")
            return "Non défini"
        except (ValueError, TypeError):
            return "Date invalide"
    updated_at_safe.short_description = "Modifié le"
    updated_at_safe.admin_order_field = 'updated_at'
    
    def logo_preview(self, obj):
        """Aperçu du logo"""
        try:
            if obj.logo:
                return format_html(
                    '<img src="{}" width="40" height="40" style="border-radius: 50%; border: 1px solid #ddd;" />',
                    obj.logo.url
                )
            elif obj.logo_url:
                return format_html(
                    '<img src="{}" width="40" height="40" style="border-radius: 50%; border: 1px solid #ddd;" />',
                    obj.logo_url
                )
            return "Pas de logo"
        except Exception:
            return "Erreur logo"
    logo_preview.short_description = "Aperçu"
    
    def logo_url_display(self, obj):
        """Affiche l'URL du logo"""
        if obj.logo_url:
            return format_html(
                '<a href="{}" target="_blank" style="color: #007cba;">🔗 Voir l\'image</a>',
                obj.logo_url
            )
        return "Pas d'URL"
    logo_url_display.short_description = "URL du logo"
    
    def socials_count(self, obj):
        """Compte le nombre de réseaux sociaux utilisant ce type"""
        return obj.social_set.count()
    socials_count.short_description = "Utilisations"
    
    def save_model(self, request, obj, form, change):
        """Override pour afficher un message personnalisé"""
        super().save_model(request, obj, form, change)
        if obj.logo:
            self.message_user(
                request, 
                f'SocialType "{obj.label}" sauvegardé. Logo disponible à: {obj.logo_url}',
                level='SUCCESS'
            )


# Configuration optionnelle : personnaliser l'en-tête de l'admin
admin.site.site_header = "Administration Portfolio"
admin.site.site_title = "Portfolio Admin"
admin.site.index_title = "Panneau d'administration du Portfolio"

# Personnalisation CSS pour améliorer l'affichage des images
admin.site.enable_nav_sidebar = True