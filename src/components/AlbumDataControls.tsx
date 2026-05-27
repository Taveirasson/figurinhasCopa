import * as Clipboard from "expo-clipboard";
import * as DocumentPicker from "expo-document-picker";
import { File, Paths } from "expo-file-system";
import React, { useState } from "react";
import {
  Alert,
  Modal,
  Share,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAlbum } from "../context/AlbumContext";
import { useTheme } from "../theme";

export const AlbumDataControls: React.FC = () => {
  const { exportAlbum, importAlbum, clearAlbum } = useAlbum();
  const { colors } = useTheme();

  const [exportText, setExportText] = useState("");
  const [exportModalVisible, setExportModalVisible] = useState(false);
  const [importText, setImportText] = useState("");
  const [importTextModalVisible, setImportTextModalVisible] = useState(false);

  const handleExportFile = async () => {
    try {
      const data = await exportAlbum();
      const fileName = `figurinha-album-${new Date().toISOString()}.json`;
      const file = new File(Paths.document, fileName);
      file.write(data);
      await Share.share({ url: file.uri, title: "Exportar álbum" as any });
    } catch (e) {
      Alert.alert("Erro", "Falha ao exportar o álbum.");
    }
  };

  const handleExportAsText = async () => {
    try {
      const data = await exportAlbum();
      setExportText(data);
      setExportModalVisible(true);
    } catch (e) {
      Alert.alert("Erro", "Falha ao gerar texto de exportação.");
    }
  };

  const handleCopyExport = async () => {
    try {
      await Clipboard.setStringAsync(exportText);
      Alert.alert("Copiado", "JSON copiado para a área de transferência.");
    } catch (e) {
      Alert.alert("Erro", "Falha ao copiar para a área de transferência.");
    }
  };

  const handleImportFromPicker = async () => {
    try {
      const res = await DocumentPicker.getDocumentAsync({
        type: "application/json",
      });
      const r = res as any;
      if (r.type === "success" || r.uri || r.fileUri || r.uriContent) {
        const uri: string | undefined = r.uri ?? r.fileUri ?? r.uriContent;
        if (!uri) {
          Alert.alert(
            "Erro",
            "O arquivo selecionado não possui URI disponível.",
          );
          return;
        }
        const file = new File(uri);
        const content = await file.text();
        await importAlbum(content);
        Alert.alert("Importar", "Álbum importado com sucesso.");
      }
    } catch (e) {
      Alert.alert("Erro", "Falha ao importar o álbum. Verifique o arquivo.");
    }
  };

  const handleImportFromText = async () => {
    if (!importText.trim()) {
      Alert.alert("Importar", "Cole o JSON do álbum primeiro.");
      return;
    }
    try {
      await importAlbum(importText);
      Alert.alert("Importar", "Álbum importado com sucesso.");
      setImportText("");
      setImportTextModalVisible(false);
    } catch (e) {
      Alert.alert("Erro", "Falha ao importar o álbum. Verifique o JSON.");
    }
  };

  const handleClear = () => {
    Alert.alert(
      "Limpar álbum",
      "Tem certeza que deseja limpar todos os dados do álbum? Esta ação não pode ser desfeita.",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Limpar",
          style: "destructive",
          onPress: async () => {
            try {
              await clearAlbum();
              Alert.alert("Limpar", "Álbum limpo.");
            } catch (e) {
              Alert.alert("Erro", "Falha ao limpar o álbum.");
            }
          },
        },
      ],
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <TouchableOpacity
        style={[styles.button, { backgroundColor: colors.primary }]}
        onPress={handleExportFile}
      >
        <Text style={styles.buttonText}>Exportar arquivo</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, { backgroundColor: colors.primary }]}
        onPress={handleExportAsText}
      >
        <Text style={styles.buttonText}>Exportar como texto</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, { backgroundColor: colors.primary }]}
        onPress={handleImportFromPicker}
      >
        <Text style={styles.buttonText}>Importar arquivo</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, { backgroundColor: colors.primary }]}
        onPress={() => setImportTextModalVisible(true)}
      >
        <Text style={styles.buttonText}>Importar por texto</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.danger, { backgroundColor: colors.danger }]}
        onPress={handleClear}
      >
        <Text style={styles.buttonText}>Limpar dados</Text>
      </TouchableOpacity>

      <Modal visible={exportModalVisible} animationType="slide">
        <SafeAreaView
          style={[
            styles.modalContainer,
            { backgroundColor: colors.background },
          ]}
        >
          <Text style={styles.modalTitle}>Exportar álbum (texto)</Text>
          <TextInput
            value={exportText}
            onChangeText={setExportText}
            multiline
            style={[
              styles.textInput,
              { color: colors.text, borderColor: colors.border },
            ]}
            editable={false}
            textAlignVertical="top"
          />
          <View style={styles.modalActions}>
            <TouchableOpacity
              style={[styles.modalButton, { backgroundColor: colors.surface }]}
              onPress={() => setExportModalVisible(false)}
            >
              <Text>Fechar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.modalButton, { backgroundColor: colors.surface }]}
              onPress={handleCopyExport}
            >
              <Text>Copiar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.modalButton, { backgroundColor: colors.surface }]}
              onPress={() => Share.share({ message: exportText })}
            >
              <Text>Compartilhar</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </Modal>

      <Modal visible={importTextModalVisible} animationType="slide">
        <SafeAreaView
          style={[
            styles.modalContainer,
            { backgroundColor: colors.background },
          ]}
        >
          <Text style={styles.modalTitle}>Importar álbum (colar JSON)</Text>
          <TextInput
            value={importText}
            onChangeText={setImportText}
            multiline
            style={[
              styles.textInput,
              { color: colors.text, borderColor: colors.border },
            ]}
            placeholder="Cole aqui o JSON exportado do álbum"
            textAlignVertical="top"
          />
          <View style={styles.modalActions}>
            <TouchableOpacity
              style={[styles.modalButton, { backgroundColor: colors.surface }]}
              onPress={() => setImportTextModalVisible(false)}
            >
              <Text>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.modalButton, { backgroundColor: colors.surface }]}
              onPress={handleImportFromText}
            >
              <Text>Importar</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { marginTop: 16 },
  button: {
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 8,
  },
  danger: {
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 8,
  },
  buttonText: { color: "#fff", fontWeight: "600" },
  modalContainer: { flex: 1, padding: 16 },
  modalTitle: { fontSize: 16, fontWeight: "700", marginBottom: 8 },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 8,
    padding: 8,
    marginBottom: 12,
  },
  modalActions: { flexDirection: "row", justifyContent: "space-between" },
  modalButton: {
    padding: 12,
    borderRadius: 8,
    minWidth: 120,
    alignItems: "center",
  },
});

export default AlbumDataControls;
