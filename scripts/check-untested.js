#!/usr/bin/env node

import { execSync } from 'child_process';
import { readdirSync, statSync } from 'fs';
import { join, extname, relative } from 'path';

// Función para encontrar todos los archivos TypeScript en src/
function findTsFiles(dir, files = []) {
  const items = readdirSync(dir);
  
  for (const item of items) {
    const fullPath = join(dir, item);
    const stat = statSync(fullPath);
    
    if (stat.isDirectory()) {
      findTsFiles(fullPath, files);
    } else if (extname(item) === '.ts' && !item.includes('.test.') && !item.includes('.spec.') && !item.includes('.d.ts')) {
      files.push(fullPath);
    }
  }
  
  return files;
}

// Función para encontrar archivos de prueba
function findTestFiles(dir, files = []) {
  const items = readdirSync(dir);
  
  for (const item of items) {
    const fullPath = join(dir, item);
    const stat = statSync(fullPath);
    
    if (stat.isDirectory()) {
      findTestFiles(fullPath, files);
    } else if ((item.includes('.test.') || item.includes('.spec.')) && extname(item) === '.ts') {
      files.push(fullPath);
    }
  }
  
  return files;
}

console.log('🔍 Analizando archivos sin testear...\n');

const srcDir = './src';
const allTsFiles = findTsFiles(srcDir);
const testFiles = findTestFiles(srcDir);

// Extraer nombres base de archivos de prueba
const testedFiles = new Set();
testFiles.forEach(testFile => {
  const baseName = testFile
    .replace(/\.test\.ts$/, '.ts')
    .replace(/\.spec\.ts$/, '.ts');
  testedFiles.add(baseName);
});

// Encontrar archivos sin testear
const untestedFiles = allTsFiles.filter(file => !testedFiles.has(file));

if (untestedFiles.length === 0) {
  console.log('✅ ¡Todos los archivos tienen pruebas!');
} else {
  console.log(`❌ Archivos sin testear (${untestedFiles.length}):`);
  untestedFiles.forEach(file => {
    const relativePath = relative('.', file);
    console.log(`   📄 ${relativePath}`);
  });
  
  console.log('\n📊 Resumen:');
  console.log(`   Total de archivos: ${allTsFiles.length}`);
  console.log(`   Con pruebas: ${allTsFiles.length - untestedFiles.length}`);
  console.log(`   Sin pruebas: ${untestedFiles.length}`);
  console.log(`   Cobertura: ${Math.round(((allTsFiles.length - untestedFiles.length) / allTsFiles.length) * 100)}%`);
}

console.log('\n💡 Para ver la cobertura detallada ejecuta: pnpm run test:coverage')
console.log('💡 Para modo watch interactivo: pnpm run test:watch')
console.log('💡 Para interfaz web: pnpm run test:ui');