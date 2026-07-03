export type Locale = 'en' | 'vi' | 'zh' | 'ja';

export interface Translation {
    // Common
    common: {
        save: string;
        cancel: string;
        delete: string;
        edit: string;
        close: string;
        search: string;
        filter: string;
        sort: string;
        settings: string;
        loading: string;
        error: string;
        success: string;
        confirm: string;
        back: string;
        next: string;
        previous: string;
        add: string;
        create: string;
        update: string;
        remove: string;
        archive: string;
        restore: string;
        export: string;
        import: string;
        yes: string;
        no: string;
    };

    // Navigation
    nav: {
        home: string;
        cards: string;
        workspaces: string;
        settings: string;
        search: string;
        graph: string;
    };

    // Settings
    settings: {
        general: string;
        appearance: string;
        apiKeys: string;
        backup: string;
        about: string;

        // General Settings
        generalSettings: string;
        managePreferences: string;
        language: string;
        selectLanguage: string;
        defaultView: string;
        chooseDefaultView: string;
        cardsPerPage: string;
        cardsPerPageDesc: string;
        preferences: string;
        autoSave: string;
        autoSaveDesc: string;
        notifications: string;
        notificationsDesc: string;
        confirmBeforeDelete: string;
        confirmBeforeDeleteDesc: string;
        enableAnimations: string;
        enableAnimationsDesc: string;
        enableSounds: string;
        enableSoundsDesc: string;
        resetToDefaults: string;
        settingsReset: string;
        settingUpdated: string;

        // View modes
        grid: string;
        list: string;
        timeline: string;

        // Appearance Settings
        theme: string;
        themeLight: string;
        themeDark: string;
        themeSystem: string;
        themeLightDesc: string;
        themeDarkDesc: string;
        themeSystemDesc: string;
        accentColor: string;
        preview: string;
        colorPalette: string;

        // Update Settings
        updates: string;
        checkForUpdates: string;
        checkingForUpdates: string;
        updateAvailable: string;
        updateNotAvailable: string;
        downloadingUpdate: string;
        updateDownloaded: string;
        installUpdate: string;
        currentVersion: string;
        latestVersion: string;
        releaseNotes: string;
        autoUpdate: string;
        autoUpdateDesc: string;
    };

    // Cards
    cards: {
        newCard: string;
        editCard: string;
        deleteCard: string;
        archiveCard: string;
        favoriteCard: string;
        shareCard: string;
        duplicateCard: string;

        title: string;
        description: string;
        content: string;
        tags: string;
        category: string;
        color: string;
        url: string;

        created: string;
        updated: string;
        type: string;

        note: string;
        website: string;
        github: string;
        youtube: string;
        movie: string;
        todo: string;
    };

    // Workspaces
    workspaces: {
        myWorkspaces: string;
        newWorkspace: string;
        editWorkspace: string;
        deleteWorkspace: string;
        workspaceName: string;
        workspaceType: string;
        workspaceColor: string;
        workspaceIcon: string;

        personal: string;
        coding: string;
        movies: string;
        school: string;
        business: string;
        photography: string;
    };

    // Search
    search: {
        placeholder: string;
        noResults: string;
        searchResults: string;
        foundCards: string;
    };

    // Toast messages
    toast: {
        cardCreated: string;
        cardUpdated: string;
        cardDeleted: string;
        cardArchived: string;
        cardRestored: string;
        workspaceCreated: string;
        workspaceUpdated: string;
        workspaceDeleted: string;
        settingsSaved: string;
        exportSuccess: string;
        importSuccess: string;
        copySuccess: string;
        error: string;
    };

    // Dialogs
    dialogs: {
        deleteCard: string;
        deleteCardConfirm: string;
        deleteWorkspace: string;
        deleteWorkspaceConfirm: string;
        unsavedChanges: string;
        unsavedChangesDesc: string;
    };

    // Metadata
    metadata: {
        views: string;
        stars: string;
        forks: string;
        rating: string;
        duration: string;
        releaseDate: string;
        channel: string;
        uploadDate: string;
        watchLater: string;
        completed: string;
        dueDate: string;
        priority: string;
    };
}
