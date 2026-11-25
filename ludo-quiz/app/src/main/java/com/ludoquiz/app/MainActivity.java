package com.ludoquiz.app;

import android.app.Activity;
import android.content.ClipData;
import android.content.Intent;
import android.net.Uri;
import android.os.Bundle;
import android.provider.MediaStore;
import android.view.View;
import android.webkit.ValueCallback;
import android.webkit.WebChromeClient;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import androidx.core.content.FileProvider;
import java.io.File;
import java.io.IOException;

public class MainActivity extends Activity {
    private static final int PHOTO_REQUEST = 109;
    private ValueCallback<Uri[]> uploadCallback;
    private Uri photoUri;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        WebView webView = new WebView(this);
        WebSettings settings = webView.getSettings();
        settings.setJavaScriptEnabled(true);
        settings.setDomStorageEnabled(true);
        settings.setAllowFileAccess(true);
        settings.setDefaultTextEncodingName("UTF-8");
        webView.setWebChromeClient(new WebChromeClient() {
            @Override
            public boolean onShowFileChooser(WebView view, ValueCallback<Uri[]> callback, FileChooserParams params) {
                if (uploadCallback != null) uploadCallback.onReceiveValue(null);
                uploadCallback = callback;
                photoUri = null;
                Intent picker = new Intent(Intent.ACTION_GET_CONTENT);
                picker.setType("image/*");
                picker.addCategory(Intent.CATEGORY_OPENABLE);
                Intent camera = new Intent(MediaStore.ACTION_IMAGE_CAPTURE);
                try {
                    File folder = new File(getCacheDir(), "photos");
                    if (!folder.exists() && !folder.mkdirs()) throw new IOException("Cannot create photo folder");
                    File output = File.createTempFile("ludo_profile_", ".jpg", folder);
                    photoUri = FileProvider.getUriForFile(MainActivity.this, getPackageName() + ".fileprovider", output);
                    camera.putExtra(MediaStore.EXTRA_OUTPUT, photoUri);
                    camera.setClipData(ClipData.newRawUri("photo", photoUri));
                    camera.addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION | Intent.FLAG_GRANT_WRITE_URI_PERMISSION);
                } catch (Exception ex) {
                    camera = null;
                    photoUri = null;
                }
                try {
                    if (params.isCaptureEnabled() && camera != null) {
                        startActivityForResult(camera, PHOTO_REQUEST);
                    } else {
                        Intent chooser = Intent.createChooser(picker, "Foto do jogador / Foto del jugador");
                        if (camera != null) chooser.putExtra(Intent.EXTRA_INITIAL_INTENTS, new Intent[] {camera});
                        startActivityForResult(chooser, PHOTO_REQUEST);
                    }
                } catch (Exception ex) {
                    try { startActivityForResult(picker, PHOTO_REQUEST); }
                    catch (Exception fallback) { uploadCallback.onReceiveValue(null); uploadCallback = null; }
                }
                return true;
            }
        });
        webView.setWebViewClient(new WebViewClient());
        webView.setKeepScreenOn(true);
        webView.setSystemUiVisibility(5894);
        setContentView(webView);
        webView.loadUrl("file:///android_asset/index.html");
    }

    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        if (requestCode != PHOTO_REQUEST || uploadCallback == null) return;
        Uri[] result = null;
        if (resultCode == RESULT_OK) {
            if (data != null && data.getData() != null) result = new Uri[] {data.getData()};
            else if (photoUri != null) result = new Uri[] {photoUri};
        }
        uploadCallback.onReceiveValue(result);
        uploadCallback = null;
        photoUri = null;
    }
}
