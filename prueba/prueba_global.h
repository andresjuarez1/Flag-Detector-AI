#ifndef PRUEBA_GLOBAL_H
#define PRUEBA_GLOBAL_H

#include <QtCore/qglobal.h>

#if defined(PRUEBA_LIBRARY)
#  define PRUEBA_EXPORT Q_DECL_EXPORT
#else
#  define PRUEBA_EXPORT Q_DECL_IMPORT
#endif

#endif // PRUEBA_GLOBAL_H
